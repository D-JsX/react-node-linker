import React, {
  useRef,
  useEffect,
  useCallback,
  PropsWithChildren,
} from 'react';
import BezierCurve from '../components/BezierCurve';
import { useCanvasStore } from './store';
import Box from '../box';

const ConnectionContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const boxesRef = useRef<
    Record<
      string,
      {
        leftRef: React.RefObject<HTMLDivElement>;
        rightRef: React.RefObject<HTMLDivElement>;
      }
    >
  >({});

  const connections = useCanvasStore((state) => state.connections);
  const currentConnection = useCanvasStore((state) => state.currentConnection);
  const selectedConnection = useCanvasStore(
    (state) => state.selectedConnection,
  );
  const setCurrentConnection = useCanvasStore(
    (state) => state.setCurrentConnection,
  );
  const addConnection = useCanvasStore((state) => state.addConnection);
  const selectConnection = useCanvasStore((state) => state.selectConnection);

  const currentConnectionRef = useRef(currentConnection);

  useEffect(() => {
    currentConnectionRef.current = currentConnection;
  }, [currentConnection]);

  const getCoordinates = useCallback(
    (boxId: string, position: 'left' | 'right'): { x: number; y: number } => {
      const box = boxesRef.current[boxId];
      if (box && svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const circleRef = position === 'left' ? box.leftRef : box.rightRef;
        if (circleRef.current) {
          const circleRect = circleRef.current.getBoundingClientRect();
          return {
            x: circleRect.left + circleRect.width / 2 - svgRect.left,
            y: circleRect.top + circleRect.height / 2 - svgRect.top,
          };
        }
      }
      return { x: 0, y: 0 };
    },
    [svgRef, boxesRef],
  );

  const isPointOnCircle = (
    x: number,
    y: number,
    circleX: number,
    circleY: number,
    radius = 16,
  ) => {
    const dx = x - circleX;
    const dy = y - circleY;
    return dx * dx + dy * dy <= radius * radius;
  };

  const handlePointerMove = useRef<(event: PointerEvent) => void>(() => {});
  const handlePointerUp = useRef<() => void>(() => {});

  const handlePointerDown = (
    id: string,
    position: 'left' | 'right',
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const startCoordinates = getCoordinates(id, position);

    const initialConnection = { from: { id, position }, to: startCoordinates };
    setCurrentConnection(initialConnection);
    currentConnectionRef.current = initialConnection;

    const pointerMove = (event: PointerEvent) => {
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top;

        let updatedConnection = {
          ...currentConnectionRef.current,
          to: { x, y },
        };

        // Check if the pointer is on any circle
        for (const [boxId, refs] of Object.entries(boxesRef.current)) {
          for (const pos of ['left', 'right'] as const) {
            const { x: circleX, y: circleY } = getCoordinates(boxId, pos);
            if (isPointOnCircle(x, y, circleX, circleY)) {
              updatedConnection = {
                ...updatedConnection,
                to: { x: circleX, y: circleY },
              };
              break;
            }
          }
        }

        setCurrentConnection(updatedConnection);
        currentConnectionRef.current = updatedConnection;
      }
    };

    const pointerUp = (event: PointerEvent) => {
      if (currentConnectionRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top;

        let foundConnection = false;

        for (const [boxId, refs] of Object.entries(boxesRef.current)) {
          for (const pos of ['left', 'right'] as const) {
            const { x: circleX, y: circleY } = getCoordinates(boxId, pos);
            if (isPointOnCircle(x, y, circleX, circleY)) {
              addConnection({
                from: currentConnectionRef.current.from,
                to: { id: boxId, position: pos },
              });
              foundConnection = true;
              break;
            }
          }
          if (foundConnection) break;
        }

        setCurrentConnection(null);
        currentConnectionRef.current = null;
      }
      window.removeEventListener('pointermove', handlePointerMove.current);
      window.removeEventListener('pointerup', handlePointerUp.current);
    };

    handlePointerMove.current = pointerMove;
    handlePointerUp.current = pointerUp;

    window.addEventListener('pointermove', handlePointerMove.current);
    window.addEventListener('pointerup', handlePointerUp.current);
  };

  const handleCanvasClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    if (event.target instanceof SVGElement && event.target.tagName !== 'path') {
      selectConnection(null);
    }
  };

  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const { children: nestedChildren, ...rest } = child.props;

        if (child.type === Box) {
          const id =
            child.props.id || `${Object.keys(boxesRef.current).length}`;
          return React.cloneElement(child, {
            ...rest,
            ref: (el) => {
              if (el) {
                boxesRef.current[id] = {
                  leftRef: el.leftRef,
                  rightRef: el.rightRef,
                };
              }
            },
            id,
            onPointerDown: handlePointerDown,
            children: processChildren(nestedChildren),
          });
        } else if (nestedChildren) {
          return React.cloneElement(child, {
            ...rest,
            children: processChildren(nestedChildren),
          });
        }
      }
      return child;
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        onClick={handleCanvasClick}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3445,
        }}
      >
        {currentConnection && (
          <BezierCurve
            start={getCoordinates(
              currentConnection.from.id,
              currentConnection.from.position,
            )}
            end={currentConnection.to}
            selected={false}
            onClick={() => {}}
          />
        )}
        {connections.map((conn, index) => (
          <BezierCurve
            key={index}
            start={getCoordinates(conn.from.id, conn.from.position)}
            end={getCoordinates(conn.to.id, conn.to.position)}
            selected={index === selectedConnection}
            onClick={() => {
              selectConnection(index === selectedConnection ? null : index);
            }}
          />
        ))}
      </svg>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {processChildren(children)}
      </div>
    </div>
  );
};

export default ConnectionContainer;
