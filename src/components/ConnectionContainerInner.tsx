import React, { useRef, useEffect, useCallback, PropsWithChildren, useState } from "react";
import BezierCurve from "./BezierCurve";
import { useConnections } from "../connection-container/ConnectionsContext";
import { useBoxRefs } from "../connection-container/BoxRefsContext";
import { Point } from "..";

type Props = {
    onConnectionAdded?: (fromId: string, toId: string) => void;
    onClickLink?: (fromId: string, toId: string) => void;
};
const ConnectionContainerInner: React.FC<PropsWithChildren<Props>> = ({ children, onConnectionAdded, onClickLink }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const { refs, getRef } = useBoxRefs();
    const { connections, currentConnection, setCurrentConnection, selectConnection, displayMode } = useConnections();
    const currentConnectionRef = useRef(currentConnection);

    useEffect(() => {
        currentConnectionRef.current = currentConnection;
    }, [currentConnection]);

    const getCoordinates = useCallback(
        (boxId: string, position: "left" | "right"): { x: number; y: number } => {
            const box = getRef(boxId);
            if (box && svgRef.current) {
                const svgRect = svgRef.current.getBoundingClientRect();
                const circleRef = position === "left" ? box.leftRef : box.rightRef;
                if (circleRef.current) {
                    const circleRect = circleRef.current.getBoundingClientRect();
                    return {
                        x: circleRect.left + circleRect.width / 2 - svgRect.left,
                        y: circleRect.top + circleRect.height / 2 - svgRect.top
                    };
                }
            }
            return { x: 0, y: 0 };
        },
        [svgRef, getRef, refs, connections]
    );

    const isPointOnCircle = (x: number, y: number, circleX: number, circleY: number, radius = 16) => {
        const dx = x - circleX;
        const dy = y - circleY;
        return dx * dx + dy * dy <= radius * radius;
    };

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            if (svgRef.current && currentConnectionRef.current) {
                const svgRect = svgRef.current.getBoundingClientRect();
                const x = event.clientX - svgRect.left;
                const y = event.clientY - svgRect.top;

                let updatedConnection = {
                    ...currentConnectionRef.current,
                    to: { x, y }
                };

                // Check if the pointer is on any circle
                Object.entries(refs.current).forEach(([boxId]) => {
                    ["left", "right"].forEach(pos => {
                        const { x: circleX, y: circleY } = getCoordinates(boxId, pos as "left" | "right");
                        if (isPointOnCircle(x, y, circleX, circleY)) {
                            updatedConnection = {
                                ...updatedConnection,
                                to: { x: circleX, y: circleY }
                            };
                        }
                    });
                });

                !displayMode && setCurrentConnection(updatedConnection);
                currentConnectionRef.current = updatedConnection;
            }
        },
        [getCoordinates, refs, setCurrentConnection]
    );

    const handlePointerUp = useCallback(
        (event: PointerEvent) => {
            if (currentConnectionRef.current) {
                const svgRect = svgRef.current?.getBoundingClientRect();
                const x = event.clientX - (svgRect?.left || 0);
                const y = event.clientY - (svgRect?.top || 0);

                let foundConnection = false;

                Object.entries(refs.current).forEach(([boxId, _]) => {
                    ["left", "right"].forEach(pos => {
                        const { x: circleX, y: circleY } = getCoordinates(boxId, pos as "left" | "right");
                        if (
                            isPointOnCircle(x, y, circleX, circleY) &&
                            currentConnectionRef.current!.from.id !== boxId
                        ) {
                            !displayMode &&
                                onConnectionAdded &&
                                onConnectionAdded(currentConnectionRef.current!.from.id, boxId);
                            foundConnection = true;
                        }
                    });
                });
                if (!foundConnection) {
                    setCurrentConnection(null);
                    currentConnectionRef.current = null;
                }
            }
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            setCurrentConnection(null);
            currentConnectionRef.current = null;
        },
        [getCoordinates, refs, setCurrentConnection, handlePointerMove]
    );

    useEffect(() => {
        if (currentConnection) {
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
        }

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp, currentConnection]);

    const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (event.target instanceof SVGElement && event.target.tagName !== "path") {
            selectConnection(null);
        }
    };

    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            if (svgRef.current && Object.keys(refs.current).length > 0) {
                clearInterval(interval);
                setIsReady(true);
            }
        }, 10);
        return () => clearInterval(interval);
    }, [refs, svgRef]);

    useEffect(() => {
        if (svgRef.current) {
            const contentWidth = svgRef.current.parentElement?.scrollWidth;
            svgRef.current.style.width = contentWidth + "px";
        }
    }, []);

    return (
        <div style={{ overflow: "auto", position: "relative", width: "100%", height: "100%" }}>
            <svg
                ref={svgRef}
                onClick={handleCanvasClick}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "calc(100% - 3.25rem)",
                    zIndex: displayMode ? undefined : 100
                }}>
                {currentConnection && (
                    <BezierCurve
                        start={getCoordinates(currentConnection.from.id, currentConnection.from.position)}
                        end={
                            (currentConnection.to as Point)?.position
                                ? getCoordinates(
                                      (currentConnection.to as Point).id,
                                      (currentConnection.to as Point).position
                                  )
                                : (currentConnection.to as { x: number; y: number })
                        }
                        onClick={() => {}}
                    />
                )}
                {isReady &&
                    connections.map((conn, index) => (
                        <BezierCurve
                            key={index}
                            start={getCoordinates(conn.from.id, conn.from.position)}
                            end={"id" in conn.to ? getCoordinates(conn.to.id, conn.to.position) : conn.to}
                            onClick={() => onClickLink && onClickLink(conn.from.id, (conn.to as Point).id)}
                        />
                    ))}
            </svg>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
        </div>
    );
};

export default ConnectionContainerInner;
