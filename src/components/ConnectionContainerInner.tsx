import React, { useRef, useEffect, useCallback, PropsWithChildren } from 'react';
import BezierCurve from './BezierCurve';
import { useConnections } from '../connection-container/ConnectionsContext';
import { useBoxRefs } from '../connection-container/BoxRefsContext';

const ConnectionContainerInner: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { refs, getRef } = useBoxRefs();
  const {
    connections,
    currentConnection,
    selectedConnection,
    setCurrentConnection,
    addConnection,
    selectConnection,
    removeConnection,
  } = useConnections();

  const currentConnectionRef = useRef(currentConnection);

  useEffect(() => {
    currentConnectionRef.current = currentConnection;
  }, [currentConnection]);

  const getCoordinates = useCallback(
    (boxId: string, position: 'left' | 'right'): { x: number; y: number } => {
      const box = getRef(boxId);
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
    [svgRef, getRef],
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

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (svgRef.current && currentConnectionRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - svgRect.left;
      const y = event.clientY - svgRect.top;

      let updatedConnection = {
        ...currentConnectionRef.current,
        to: { x, y },
      };

      // Check if the pointer is on any circle
      Object.entries(refs.current).forEach(([boxId, refs]) => {
        ['left', 'right'].forEach((pos) => {
          const { x: circleX, y: circleY } = getCoordinates(boxId, pos as 'left' | 'right');
          if (isPointOnCircle(x, y, circleX, circleY)) {
            updatedConnection = {
              ...updatedConnection,
              to: { x: circleX, y: circleY },
            };
          }
        });
      });

      setCurrentConnection(updatedConnection);
      currentConnectionRef.current = updatedConnection;
    }
  }, [getCoordinates, refs, setCurrentConnection]);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (currentConnectionRef.current) {
      const svgRect = svgRef.current?.getBoundingClientRect();
      const x = event.clientX - (svgRect?.left || 0);
      const y = event.clientY - (svgRect?.top || 0);

      let foundConnection = false;

      Object.entries(refs.current).forEach(([boxId, refs]) => {
        ['left', 'right'].forEach((pos) => {
          const { x: circleX, y: circleY } = getCoordinates(boxId, pos as 'left' | 'right');
          if (isPointOnCircle(x, y, circleX, circleY)) {
            addConnection({
              from: currentConnectionRef.current!.from,
              to: { id: boxId, position: pos as 'left' | 'right' },
            });
            foundConnection = true;
          }
        });
      });

      if (!foundConnection) {
        setCurrentConnection(null);
        currentConnectionRef.current = null;
      }
    }
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    setCurrentConnection(null);
    currentConnectionRef.current = null;
  }, [getCoordinates, refs, setCurrentConnection, addConnection, handlePointerMove]);

  useEffect(() => {
    if (currentConnection) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp, currentConnection]);

  const handleCanvasClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    if (event.target instanceof SVGElement && event.target.tagName !== 'path') {
      selectConnection(null);
    }
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
          zIndex: 3445
        }}
      >
        {currentConnection && (
          <BezierCurve
            start={getCoordinates(
              currentConnection.from.id,
              currentConnection.from.position,
            )}
            end={currentConnection.to?.position ? getCoordinates(
                currentConnection.to.id,
                currentConnection.to.position,
              ) : currentConnection.to}
            selected={false}
            onClick={() => {}}
          />
        )}
        {connections.map((conn, index) => (
          <BezierCurve
            key={index}
            start={getCoordinates(conn.from.id, conn.from.position)}
            end={
              'id' in conn.to
                ? getCoordinates(conn.to.id, conn.to.position)
                : conn.to
            }
            selected={index === selectedConnection}
            onClick={() => selectConnection(index)}
            onDoubleClick={() => removeConnection(index)}
          />
        ))}
      </svg>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default ConnectionContainerInner;
