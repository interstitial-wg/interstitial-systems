"use client";

import React from "react";
import Link from "next/link";
import { BsCircleFill, BsCircle } from "react-icons/bs";
import { SiGithub } from "react-icons/si";
import { HiMail } from "react-icons/hi";

// Import data
import releasesData from "../data/releases.json";

export default function Releases() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Link href="/" className="text-sm font-mono mb-8 inline-block">
        ← Back to home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Releases</h1>

      <p className="mb-8">
        Our releases showcase our research findings, tools, and insights. Each
        release represents a milestone in our exploration of the interstitial
        spaces between technology, design, and climate impact.
      </p>

      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Projects</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-mono font-medium">Name</th>
                <th className="text-left py-2 font-mono font-medium">
                  Version
                </th>
                <th className="text-left py-2 font-mono font-medium">Links</th>
                <th className="text-left py-2 font-mono font-medium">Collab</th>
              </tr>
            </thead>
            <tbody>
              {releasesData.releases.map((release, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-0"
                >
                  <td className="py-2 font-mono">{release.name}</td>
                  <td className="py-2 font-mono">{release.version}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      {release.codeLink && (
                        <Link
                          href={release.codeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <SiGithub className="w-4 h-4" />
                        </Link>
                      )}
                      {release.notesLink && (
                        <Link
                          href={release.notesLink}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <HiMail className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="py-2">
                    {release.hasCollaborator ? (
                      <BsCircleFill className="w-3 h-3 text-gray-600" />
                    ) : (
                      <BsCircle className="w-3 h-3 text-gray-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="prose">
        <h2 className="text-xl font-bold mb-4">Release Notes</h2>
        <p className="mb-4">
          We publish detailed release notes for our major updates and findings.
          These are typically sent through our newsletter with the
          &quot;release&quot; tag.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 italic">
            No release notes have been published yet. Subscribe to our
            newsletter to receive updates when new releases are available.
          </p>

          <Link
            href="/newsletter"
            className="mt-4 inline-block bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </div>
    </div>
  );
}
