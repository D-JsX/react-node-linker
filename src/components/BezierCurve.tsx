import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BezierCurveProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  selected: boolean;
  onClick: () => void;
}

const BezierCurve: React.FC<BezierCurveProps> = ({
  start,
  end,
  selected,
  onClick,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear the SVG content before new render

    const pathData = `M${start.x},${start.y} C${(start.x + end.x) / 2},${start.y} ${(start.x + end.x) / 2},${end.y} ${end.x},${end.y}`;

    svg
      .append('path')
      .attr('d', pathData)
      .attr('stroke', '#b1b1b7')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('cursor', 'pointer')
      .attr('z-index', 12344);
    // .on('click', onClick)
    // .classed('selected', selected);
  }, [start, end, selected, onClick]);

  return (
    <svg
      ref={ref}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 123344,
      }}
    ></svg>
  );
};

export default BezierCurve;
