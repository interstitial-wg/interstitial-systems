"use client";

import React from "react";
import Link from "next/link";

export default function RSS() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link href="/" className="text-sm font-mono mb-8 inline-block">
        ← Back to home
      </Link>

      <h1 className="text-3xl font-bold mb-6">RSS Feed</h1>

      <p className="mb-6">
        Stay updated with our latest research, releases, and insights by
        subscribing to our RSS feed.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4">How to Subscribe</h2>

        <p className="mb-4">
          You can subscribe to our RSS feed using any RSS reader by adding the
          following URL:
        </p>

        <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4 overflow-x-auto">
          https://interstitial.systems/feed.xml
        </div>

        <p className="text-sm text-gray-600">
          Note: Our RSS feed is currently under development and will be
          available soon.
        </p>
      </div>

      <div className="prose">
        <h2 className="text-xl font-bold mb-4">Popular RSS Readers</h2>

        <ul className="list-disc pl-5 space-y-2">
          <li>
            <a
              href="https://feedly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline"
            >
              Feedly
            </a>
          </li>
          <li>
            <a
              href="https://www.inoreader.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline"
            >
              Inoreader
            </a>
          </li>
          <li>
            <a
              href="https://newsblur.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline"
            >
              NewsBlur
            </a>
          </li>
          <li>
            <a
              href="https://netnewswire.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline"
            >
              NetNewsWire (macOS/iOS)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
