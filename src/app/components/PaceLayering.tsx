import React from "react";

const PaceLayering = () => {
  const layers = [
    { name: "FASHION", color: "#1a1a1a" },
    { name: "COMMERCE", color: "#333333" },
    { name: "INFRASTRUCTURE", color: "#4d4d4d" },
    { name: "GOVERNANCE", color: "#666666" },
    { name: "CULTURE", color: "#808080" },
    { name: "NATURE", color: "#999999" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <svg viewBox="0 0 600 300" className="w-full">
        {/* Title */}
        <text x="20" y="30" className="text-xl font-serif">
          Pace Layering
        </text>

        {/* Double frame */}
        <rect
          x="10"
          y="10"
          width="580"
          height="280"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="15"
          y="15"
          width="570"
          height="270"
          stroke="black"
          strokeWidth="1"
          fill="none"
        />

        {/* Background lines */}
        <pattern
          id="lines"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="10" y2="0" stroke="#eee" strokeWidth="0.5" />
        </pattern>
        <rect x="15" y="15" width="570" height="270" fill="url(#lines)" />

        <g transform="translate(50, 260)">
          {layers.map((layer, index) => {
            const baseRadius = 580 - index * 80;
            const rx = baseRadius;
            const ry = baseRadius * 0.2;
            const endX = baseRadius * 0.9;
            const endY = -baseRadius * 0.12;
            const pathData = `M 0,${-ry} A ${rx},${ry} 0 0,1 ${endX},${endY}`;

            return (
              <g key={layer.name}>
                {/* Static line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={layer.color}
                  strokeWidth="1.5"
                />

                {/* Path definition */}
                <defs>
                  <path id={`curve-${index}`} d={pathData} />
                </defs>

                {/* Text with highlight */}
                <text className="font-mono text-[12px]">
                  <textPath href={`#curve-${index}`} startOffset="2%">
                    <tspan fill="#e6f3ff" dy="-1" dx="15">
                      {layer.name}
                    </tspan>
                  </textPath>
                </text>

                {/* Arrow */}
                <g>
                  <path
                    d={`M 0,${-ry} l 10,0 l -4,-3 l 0,6 z`}
                    fill="#e6f3ff"
                    strokeWidth="0.5"
                    stroke="#e6f3ff"
                  />
                  <path
                    d={`M 0,${-ry} l 10,0 l -4,-3 l 0,6 z`}
                    fill={layer.color}
                    strokeWidth="0.5"
                    stroke={layer.color}
                  />
                </g>

                {/* Main text */}
                <text className="font-mono text-[12px]">
                  <textPath href={`#curve-${index}`} startOffset="2%">
                    <tspan fill={layer.color} dy="-1" dx="15">
                      {layer.name}
                    </tspan>
                  </textPath>
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default PaceLayering;
