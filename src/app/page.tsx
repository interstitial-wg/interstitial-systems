"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the Dither component with no SSR
const Dither = dynamic(() => import("./components/Dither"), {
  ssr: false,
});

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ditherSettings, setDitherSettings] = useState({
    waveSpeed: 0.1,
    waveFrequency: 1.1,
    waveAmplitude: 0.1,
    colorNum: 5,
    pixelSize: 4,
    contrast: 1.5,
    brightness: isDarkMode ? -0.06 : 0.06,
  });

  // Check system preference for dark mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initial check
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);

      // Listen for changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
        setDitherSettings((prev) => ({
          ...prev,
          brightness: e.matches ? -0.06 : 0.06,
        }));
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Add keyboard listener for 'L' key to toggle settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "l") {
        setShowSettings((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSettingChange = (setting: string, value: number) => {
    setDitherSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  return (
    <div
      className={`p-4 min-h-screen flex flex-col relative ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-white"
      }`}
    >
      {/* Dither background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Dither
          waveSpeed={ditherSettings.waveSpeed}
          waveFrequency={ditherSettings.waveFrequency}
          waveAmplitude={ditherSettings.waveAmplitude}
          waveColor={isDarkMode ? [0.2, 0.2, 0.2] : [0.5, 0.5, 0.5]}
          colorNum={ditherSettings.colorNum}
          pixelSize={ditherSettings.pixelSize}
          enableMouseInteraction={false}
          contrast={ditherSettings.contrast}
          brightness={ditherSettings.brightness}
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="flex z-10">
        <div className="text-2xl max-w-2xl">
          <span className="font-bold">Interstitial Systems</span> is a kind of
          working research group focused on making the unseen seen. We identify
          and explore the &apos;in-between&apos; layers that connect fields of
          interest, uncovering opportunities for positive climate impact. Our
          current efforts are focused on enabling AI to better understand the
          built environment.
        </div>
      </div>

      <div
        className={`mt-auto pt-8 pb-4 text-sm font-mono z-10 ${
          isDarkMode ? "text-gray-300" : "text-white"
        }`}
      >
        <div className="flex flex-col gap-2">
          <Link
            href="https://buttondown.email/interstitial"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all inline-block w-fit ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:translate-x-1"
                : "text-white hover:text-white hover:translate-x-1"
            }`}
          >
            Newsletter
          </Link>
          <Link
            href="https://bsky.app/profile/interstitial.systems"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all inline-block w-fit ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:translate-x-1"
                : "text-white hover:text-white hover:translate-x-1"
            }`}
          >
            Bluesky
          </Link>
          <Link
            href="https://www.are.na/interstitial"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all inline-block w-fit ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:translate-x-1"
                : "text-white hover:text-white hover:translate-x-1"
            }`}
          >
            Are.na
          </Link>
          <Link
            href="https://github.com/interstitial-wg"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all inline-block w-fit ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:translate-x-1"
                : "text-white hover:text-white hover:translate-x-1"
            }`}
          >
            GitHub
          </Link>
          <Link
            href="https://huggingface.co/interstitial-wg"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all inline-block w-fit ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:translate-x-1"
                : "text-white hover:text-white hover:translate-x-1"
            }`}
          >
            Hugging Face
          </Link>
        </div>
      </div>

      {/* Settings panel - now toggled with 'L' key instead of button */}
      {showSettings && (
        <div
          className={`fixed bottom-16 right-4 p-4 rounded-md shadow-lg z-20 w-64 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-700 text-white"
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">Dither Settings</h3>
            <span className="text-xs opacity-70">
              (Press &apos;L&apos; to close)
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs mb-1">
                Wave Speed: {ditherSettings.waveSpeed.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.1"
                step="0.01"
                value={ditherSettings.waveSpeed}
                onChange={(e) =>
                  handleSettingChange("waveSpeed", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">
                Wave Frequency: {ditherSettings.waveFrequency.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={ditherSettings.waveFrequency}
                onChange={(e) =>
                  handleSettingChange(
                    "waveFrequency",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">
                Wave Amplitude: {ditherSettings.waveAmplitude.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.1"
                value={ditherSettings.waveAmplitude}
                onChange={(e) =>
                  handleSettingChange(
                    "waveAmplitude",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">
                Color Steps: {ditherSettings.colorNum}
              </label>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                value={ditherSettings.colorNum}
                onChange={(e) =>
                  handleSettingChange("colorNum", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">
                Pixel Size: {ditherSettings.pixelSize}
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={ditherSettings.pixelSize}
                onChange={(e) =>
                  handleSettingChange("pixelSize", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">
                Contrast: {ditherSettings.contrast.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={ditherSettings.contrast}
                onChange={(e) =>
                  handleSettingChange("contrast", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">
                Brightness: {ditherSettings.brightness.toFixed(2)}
              </label>
              <input
                type="range"
                min="-0.2"
                max="0.2"
                step="0.01"
                value={ditherSettings.brightness}
                onChange={(e) =>
                  handleSettingChange("brightness", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
            <button
              onClick={() => {
                setDitherSettings({
                  waveSpeed: 0.1,
                  waveFrequency: 1.1,
                  waveAmplitude: 0.1,
                  colorNum: 5,
                  pixelSize: 4,
                  contrast: 1.5,
                  brightness: isDarkMode ? -0.06 : 0.06,
                });
              }}
              className={`text-xs py-1 px-2 rounded ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
