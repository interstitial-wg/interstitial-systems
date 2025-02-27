"use client";

import React from "react";

export default function DitheredBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAnSURBVHgBY2RgYPgPxAwMjAxQAOUzMUABlM/EyADFUBoKGKGGMQAAGiQDnpN32bUAAAAASUVORK5CYII=")`,
        backgroundRepeat: "repeat",
        backgroundSize: "8px 8px",
        pointerEvents: "none",
        zIndex: -1,
        opacity: 0.3,
      }}
    />
  );
}
