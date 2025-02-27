/* eslint-disable react/no-unknown-property */
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Simplified version without EffectComposer and RetroEffect

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float colorNum;
uniform float pixelSize;
uniform float contrast;
uniform float brightness;
uniform int isDarkMode;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 8;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  
  // Create a more varied pattern with rotated coordinates to avoid horizontal lines
  vec2 rotated = vec2(
    p.x * cos(0.5) - p.y * sin(0.5),
    p.x * sin(0.5) + p.y * cos(0.5)
  );
  
  float noise1 = fbm(rotated);
  float noise2 = fbm(rotated * 1.2 + noise1);
  
  // Add some variation based on time
  float timeFactor = sin(time * 0.1) * 0.1;
  
  // Add a gradient to smooth out the bottom and left edges of the screen
  // This will reduce the visibility of the pattern bleeding at the edges
  float bottomFade = smoothstep(0.0, 0.4, p.y + 0.5);
  float leftFade = smoothstep(0.0, 0.6, p.x + 0.5); // Increased fade distance for left edge
  float rightFade = smoothstep(0.0, 0.4, 0.5 - p.x);
  float topFade = smoothstep(0.0, 0.4, 0.5 - p.y);
  
  // Prioritize the left edge fade
  float edgeFade = min(leftFade, min(min(bottomFade, rightFade), topFade));
  
  return (noise2 + timeFactor) * edgeFade;
}

// Bayer matrix for dithering
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  // Add slight offset to reduce grid alignment
  vec2 offsetUv = uv + vec2(sin(uv.y * 20.0) * 0.01, cos(uv.x * 20.0) * 0.01);
  
  int x = int(offsetUv.x * resolution.x / pixelSize) % 8;
  int y = int(offsetUv.y * resolution.y / pixelSize) % 8;
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.5;
  
  // Apply dithering with moderate intensity
  color += threshold * 0.6;
  
  // Use a combination of floor and smoothstep for a more visible but still smooth pattern
  vec3 quantized = floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  return mix(quantized, smoothstep(0.2, 0.8, color), 0.3);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 pixelUv = floor(uv * resolution / pixelSize) * pixelSize / resolution;
  
  vec2 normalizedUv = pixelUv - 0.5;
  normalizedUv.x *= resolution.x / resolution.y;
  
  float f = pattern(normalizedUv);
  
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(normalizedUv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.2 * effect;
  }
  
  // Apply contrast and brightness
  f = (f - 0.5) * contrast + 0.5 + brightness;
  
  // Enhanced edge fading for all sides of the screen
  // Use stronger fading for light mode
  float edgeFadeStrength = isDarkMode == 1 ? 0.1 : 0.2;
  float leftEdge = smoothstep(0.0, edgeFadeStrength, uv.x);
  float rightEdge = smoothstep(0.0, edgeFadeStrength, 1.0 - uv.x);
  float topEdge = smoothstep(0.0, edgeFadeStrength, 1.0 - uv.y);
  float bottomEdge = smoothstep(0.0, edgeFadeStrength * 1.5, uv.y);
  
  // Combine all edge fades
  float edgeFade = min(min(leftEdge, rightEdge), min(topEdge, bottomEdge));
  f *= edgeFade;
  
  f = clamp(f, 0.0, 1.0);
  
  vec3 col = mix(vec3(0.0), waveColor, f);
  col = dither(pixelUv, col);
  
  gl_FragColor = vec4(col, 1.0);
}
`;

interface DitheredWavesProps {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
  contrast: number;
  brightness: number;
  isDarkMode: boolean;
}

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
  contrast,
  brightness,
  isDarkMode,
}: DitheredWavesProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const { viewport, size, gl } = useThree();

  const uniforms = useRef({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1, 1) },
    waveSpeed: { value: waveSpeed },
    waveFrequency: { value: waveFrequency },
    waveAmplitude: { value: waveAmplitude },
    waveColor: { value: new THREE.Color(...waveColor) },
    mousePos: { value: new THREE.Vector2(0, 0) },
    enableMouseInteraction: { value: enableMouseInteraction ? 1 : 0 },
    mouseRadius: { value: mouseRadius },
    colorNum: { value: colorNum },
    pixelSize: { value: pixelSize },
    contrast: { value: contrast },
    brightness: { value: brightness },
    isDarkMode: { value: isDarkMode ? 1 : 0 },
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const newWidth = Math.floor(size.width * dpr);
    const newHeight = Math.floor(size.height * dpr);
    uniforms.current.resolution.value.set(newWidth, newHeight);
  }, [size, gl]);

  useFrame((state) => {
    if (!disableAnimation) {
      uniforms.current.time.value = state.clock.getElapsedTime();
    }
    uniforms.current.waveSpeed.value = waveSpeed;
    uniforms.current.waveFrequency.value = waveFrequency;
    uniforms.current.waveAmplitude.value = waveAmplitude;
    uniforms.current.waveColor.value.set(...waveColor);
    uniforms.current.enableMouseInteraction.value = enableMouseInteraction
      ? 1
      : 0;
    uniforms.current.mouseRadius.value = mouseRadius;
    uniforms.current.colorNum.value = colorNum;
    uniforms.current.pixelSize.value = pixelSize;
    uniforms.current.contrast.value = contrast;
    uniforms.current.brightness.value = brightness;
    uniforms.current.isDarkMode.value = isDarkMode ? 1 : 0;

    if (enableMouseInteraction) {
      uniforms.current.mousePos.value.set(mousePos.x, mousePos.y);
    }
  });

  const handlePointerMove = (e: React.PointerEvent<THREE.Mesh>) => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    setMousePos({ x, y });
  };

  // Calculate scale to make the pattern much larger than the viewport to eliminate edge artifacts
  const extraPixels = 50; // Increased from 20 to 50 pixels
  const dpr = gl.getPixelRatio();
  const extraWidth = (extraPixels * 2 * dpr) / size.width;
  const extraHeight = (extraPixels * 2 * dpr) / size.height;
  const scaleX = viewport.width * (1 + extraWidth);
  const scaleY = viewport.height * (1 + extraHeight);

  return (
    <mesh
      ref={mesh}
      scale={[scaleX, scaleY, 1]}
      position={[0, 0, 0]}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}

interface DitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  contrast?: number;
  brightness?: number;
  isDarkMode?: boolean;
}

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  contrast = 1.0,
  brightness = 0.0,
  isDarkMode = false,
}: DitherProps) {
  // Adjust colors based on dark/light mode
  const actualWaveColor: [number, number, number] = isDarkMode
    ? waveColor
    : [
        Math.min(waveColor[0] + 0.3, 1),
        Math.min(waveColor[1] + 0.3, 1),
        Math.min(waveColor[2] + 0.3, 1),
      ];

  // Significantly adjust contrast and brightness for light mode to reduce edge visibility
  const actualContrast = isDarkMode ? contrast : contrast * 0.6;
  const actualBrightness = isDarkMode ? brightness : brightness + 0.2;

  // Adjust wave parameters for light mode to reduce edge artifacts
  const actualWaveAmplitude = isDarkMode ? waveAmplitude : waveAmplitude * 0.7;
  const actualWaveFrequency = isDarkMode ? waveFrequency : waveFrequency * 0.9;

  const isMac =
    typeof navigator !== "undefined" &&
    ((navigator as { userAgentData?: { platform: string } }).userAgentData
      ? (
          navigator as { userAgentData?: { platform: string } }
        ).userAgentData?.platform.toLowerCase() === "macos"
      : /macintosh|mac os x/i.test(navigator.userAgent));

  // Reference to the canvas container
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Apply direct styles to the canvas element after it's mounted
  useEffect(() => {
    if (canvasContainerRef.current) {
      // Find the canvas element within the container
      const canvas = canvasContainerRef.current.querySelector("canvas");
      if (canvas) {
        // Apply styles directly to the canvas
        canvas.style.width = "calc(100% + 300px)";
        canvas.style.height = "calc(100% + 200px)";
        canvas.style.position = "absolute";
        canvas.style.left = "-200px"; // Increased left offset to -200px to better hide left edge artifacts
        canvas.style.top = "-100px";
        canvas.style.transform = "scale(1.25)"; // Slightly increased scale
      }
    }
  }, []);

  return (
    <div
      ref={canvasContainerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        clipPath: "inset(0 0 0 1px)", // Add a 1px clip to the left edge
      }}
    >
      <Canvas
        className="w-full h-full"
        style={{
          padding: isMac ? "1px" : "2px",
        }}
        camera={{ position: [0, 0, 6] }}
        dpr={typeof window !== "undefined" ? window.devicePixelRatio : 1}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <DitheredWaves
          waveSpeed={waveSpeed}
          waveFrequency={actualWaveFrequency}
          waveAmplitude={actualWaveAmplitude}
          waveColor={actualWaveColor}
          colorNum={colorNum}
          pixelSize={pixelSize}
          disableAnimation={disableAnimation}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
          contrast={actualContrast}
          brightness={actualBrightness}
          isDarkMode={isDarkMode}
        />
      </Canvas>
    </div>
  );
}
