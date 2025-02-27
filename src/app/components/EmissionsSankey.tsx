import React from "react";

interface SankeyNode {
  name: string;
  value: number;
  color: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

const EmissionsSankey = () => {
  // Sample data - replace with actual emissions data
  const nodes: SankeyNode[] = [
    { name: "Buildings", value: 100, color: "#1a1a1a" },
    { name: "Materials", value: 40, color: "#333333" },
    { name: "Operations", value: 35, color: "#4d4d4d" },
    { name: "Construction", value: 25, color: "#666666" },
    { name: "End of Life", value: 20, color: "#808080" },
    { name: "Direct CO2", value: 60, color: "#b3b3b3" },
    { name: "Indirect CO2", value: 40, color: "#999999" },
  ];

  const links: SankeyLink[] = [
    { source: 0, target: 5, value: 35 },
    { source: 0, target: 6, value: 25 },
    { source: 1, target: 5, value: 25 },
    { source: 1, target: 6, value: 15 },
    { source: 2, target: 5, value: 20 },
    { source: 2, target: 6, value: 15 },
    { source: 3, target: 5, value: 15 },
    { source: 3, target: 6, value: 10 },
    { source: 4, target: 5, value: 10 },
    { source: 4, target: 6, value: 10 },
  ];

  // Calculate node positions with better spacing
  const margin = { top: 20, right: 100, bottom: 20, left: 100 };
  const width = 800;
  const height = 400;
  const nodeWidth = 15;
  const nodeSpacing = 40;
  const columnWidth = width - margin.left - margin.right;

  // Position nodes in columns
  const leftNodes = nodes.slice(0, 5);
  const rightNodes = nodes.slice(5);

  // Calculate total values for scaling
  const maxColumnValue = Math.max(
    leftNodes.reduce((sum, node) => sum + node.value, 0),
    rightNodes.reduce((sum, node) => sum + node.value, 0)
  );

  const scale =
    (height - margin.top - margin.bottom - nodeSpacing * 4) / maxColumnValue;

  return (
    <div className="w-full mx-auto my-8">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ maxHeight: "70vh" }}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Left column nodes */}
          {leftNodes.map((node, i) => {
            const y = i * (node.value * scale + nodeSpacing);
            const height = node.value * scale;
            return (
              <g key={`left-${i}`}>
                <rect
                  x={0}
                  y={y}
                  width={nodeWidth}
                  height={height}
                  fill={node.color}
                />
                <text
                  x={-10}
                  y={y + height / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-sm font-mono"
                >
                  {node.name}
                </text>
              </g>
            );
          })}

          {/* Right column nodes */}
          {rightNodes.map((node, i) => {
            const y = i * (node.value * scale + nodeSpacing);
            const height = node.value * scale;
            return (
              <g key={`right-${i}`}>
                <rect
                  x={columnWidth - nodeWidth}
                  y={y}
                  width={nodeWidth}
                  height={height}
                  fill={node.color}
                />
                <text
                  x={columnWidth + 10}
                  y={y + height / 2}
                  dominantBaseline="middle"
                  className="text-sm font-mono"
                >
                  {node.name}
                </text>
              </g>
            );
          })}

          {/* Links between nodes */}
          {links.map((link, i) => {
            const sourceNode = nodes[link.source];
            const targetNode = nodes[link.target];
            const sourceIndex = leftNodes.findIndex((n) => n === sourceNode);
            const targetIndex = rightNodes.findIndex((n) => n === targetNode);

            const sourceY =
              sourceIndex * (sourceNode.value * scale + nodeSpacing) +
              (sourceNode.value * scale - link.value * scale) / 2;
            const targetY =
              targetIndex * (targetNode.value * scale + nodeSpacing) +
              (targetNode.value * scale - link.value * scale) / 2;

            const path = `
              M ${nodeWidth} ${sourceY}
              C ${columnWidth / 3} ${sourceY},
                ${(columnWidth * 2) / 3} ${targetY},
                ${columnWidth - nodeWidth} ${targetY}
            `;

            return (
              <path
                key={`link-${i}`}
                d={path}
                fill="none"
                stroke={sourceNode.color}
                strokeOpacity={0.4}
                strokeWidth={link.value * scale}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default EmissionsSankey;
