import React, { CSSProperties, useRef, PropsWithChildren, useCallback, useEffect, FunctionComponent } from "react";
import { useBoxRefs } from "../connection-container/BoxRefsContext";
import { useConnections } from "../connection-container/ConnectionsContext";
import { Point } from "..";

type BoxProps = {
    id: string;
    displayMode?: boolean;
};

const Box: FunctionComponent<PropsWithChildren<BoxProps>> = ({ id, children, displayMode = false }) => {
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const { registerRef } = useBoxRefs();
    const { setCurrentConnection, currentConnection, connections } = useConnections();

    const isLeftSideBusy = connections.find(dt => (dt.to as Point).id === id);
    const isRightSideBusy = connections.find(dt => dt.from.id === id);

    useEffect(() => {
        registerRef(id, { leftRef, rightRef });
    }, [id, registerRef]);

    const handlePointerDown = useCallback(
        (position: "left" | "right") => (_: React.PointerEvent<HTMLDivElement>) => {
            setCurrentConnection({
                from: { id, position },
                to: { id, position }
            });
        },
        [leftRef, rightRef, setCurrentConnection, currentConnection]
    );

    return (
        <div data-link-box={id} style={{ position: "relative", display: "inline-block" }}>
            <div
                ref={leftRef}
                style={leftCircleStyle(displayMode, !!isLeftSideBusy)}
                onPointerDown={handlePointerDown("left")}
            />
            <div
                ref={rightRef}
                style={rightCircleStyle(displayMode, !!isRightSideBusy)}
                onPointerDown={handlePointerDown("right")}
            />
            {children}
        </div>
    );
};

const preventStyle: CSSProperties = {
    userSelect: "none",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none"
};

const leftCircleStyle: (displayMode: boolean, isLeftSideBusy: boolean) => CSSProperties = (
    displayMode,
    isLeftSideBusy
) => ({
    position: "absolute",
    left: displayMode ? "-2.5px" : "-5px",
    top: "50%",
    transform: "translateY(-50%)",
    width: displayMode ? (isLeftSideBusy ? "5px" : "0px") : "10px",
    height: displayMode ? "5px" : "10px",
    backgroundColor: "#b1b1b7",
    borderRadius: "50%",
    cursor: displayMode ? "default" : "crosshair",
    zIndex: 100,
    ...preventStyle
});

const rightCircleStyle: (displayMode: boolean, isRightSideBusy: boolean) => CSSProperties = (
    displayMode,
    isRightSideBusy
) => ({
    position: "absolute",
    right: displayMode ? "-2.5px" : "-5px",
    top: "50%",
    transform: "translateY(-50%)",
    width: displayMode ? (isRightSideBusy ? "5px" : "0px") : "10px",
    height: displayMode ? "5px" : "10px",
    backgroundColor: "#b1b1b7",
    borderRadius: "50%",
    cursor: displayMode ? "default" : "crosshair",
    zIndex: 100,
    ...preventStyle
});

export default Box;