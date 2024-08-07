import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useConnections } from "../connection-container/ConnectionsContext";

interface BezierCurveProps {
    start: { x: number; y: number };
    end: { x: number; y: number };
    onClick: () => void;
}

const BezierCurve: React.FC<BezierCurveProps> = ({ start, end, onClick }) => {
    const { displayMode } = useConnections();

    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear the SVG content before new render

        const pathData = `M${start.x},${start.y} C${(start.x + end.x) / 2},${start.y} ${(start.x + end.x) / 2},${
            end.y
        } ${end.x},${end.y}`;

        // Invisible wide path for capturing clicks
        svg.append("path")
            .attr("d", pathData)
            .attr("stroke", "transparent")
            .attr("stroke-width", 20) // Wider stroke for better click detection
            .attr("fill", "none")
            .attr("cursor", displayMode ? "default" : "pointer")
            .on("click", onClick);

        // Visible thin path for the curve
        svg.append("path")
            .attr("d", pathData)
            .attr("stroke", "#b1b1b7")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr("pointer-events", "none"); // Prevents this path from capturing clicks
    }, [start, end, onClick]);

    return (
        <svg
            ref={ref}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            }}></svg>
    );
};

export default BezierCurve;
