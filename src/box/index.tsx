import React, {
    CSSProperties,
    forwardRef,
    useRef,
    PropsWithChildren,
    useEffect,
    useCallback,
  } from 'react';
  import { useBoxRefs } from '../connection-container/BoxRefsContext';
  import { useConnections } from '../connection-container/ConnectionsContext';
  
  type BoxProps = {
    id: string;
  };
  
  const Box = forwardRef(
    ({ id, children }: PropsWithChildren<BoxProps>, ref) => {
      const leftRef = useRef<HTMLDivElement>(null);
      const rightRef = useRef<HTMLDivElement>(null);
      const { registerRef } = useBoxRefs();
      const { setCurrentConnection, currentConnection } = useConnections();

      useEffect(() => {
        registerRef(id, { leftRef, rightRef });
      }, [id, registerRef]);
  
      const handlePointerDown = useCallback((position: 'left' | 'right') => (event: React.PointerEvent<HTMLDivElement>) => {
          setCurrentConnection({
            from: { id, position },
            to: { id, position },
          });
      }, [leftRef, rightRef, setCurrentConnection, currentConnection]);
  
      return (
        <div
          data-link-box={id}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <div
            ref={leftRef}
            style={{
              position: 'absolute',
              left: '-5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '10px',
              height: '10px',
              backgroundColor: '#b1b1b7',
              borderRadius: '50%',
              cursor: 'crosshair',
              ...preventStyle,
            }}
            onPointerDown={handlePointerDown('left')}
          />
          <div
            ref={rightRef}
            style={{
              position: 'absolute',
              right: '-5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '10px',
              height: '10px',
              backgroundColor: '#b1b1b7',
              borderRadius: '50%',
              cursor: 'crosshair',
              ...preventStyle,
            }}
            onPointerDown={handlePointerDown('right')}
          />
          {children}
        </div>
      );
    },
  );
  
  const preventStyle: CSSProperties = {
    userDrag: 'none',
    WebkitUserDrag: 'none',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
  };
  
  export default Box;
  