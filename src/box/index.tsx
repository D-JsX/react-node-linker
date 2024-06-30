import React, {
    CSSProperties,
    forwardRef,
    useImperativeHandle,
    useRef,
    PropsWithChildren,
  } from 'react';
  
  type BoxProps = {
    id: string;
    onPointerDown: (
      id: string,
      position: 'left' | 'right',
      event: React.PointerEvent<HTMLDivElement>,
    ) => void;
  };
  
  const Box = forwardRef(
    ({ id, onPointerDown, children }: PropsWithChildren<BoxProps>, ref) => {
      const leftRef = useRef<HTMLDivElement>(null);
      const rightRef = useRef<HTMLDivElement>(null);
  
      useImperativeHandle(
        ref,
        () => ({
          leftRef,
          rightRef,
        }),
        [leftRef.current, rightRef.current],
      );
  
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
              zIndex: 34234234,
              ...preventStyle,
            }}
            onPointerDown={(event) => onPointerDown(id, 'left', event)}
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
              zIndex: 34234234,
              ...preventStyle,
            }}
            onPointerDown={(event) => onPointerDown(id, 'right', event)}
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
  