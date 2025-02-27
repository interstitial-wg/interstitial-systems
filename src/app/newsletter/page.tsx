"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Replace with your actual Buttondown API endpoint
      const response = await fetch(
        "https://api.buttondown.email/v1/subscribers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${process.env.NEXT_PUBLIC_BUTTONDOWN_API_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.status === 201) {
        setStatus("success");
        setMessage("You&apos;ve successfully subscribed to our newsletter!");
        setEmail("");
      } else {
        const data = await response.json();
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link href="/" className="text-sm font-mono mb-8 inline-block">
        ← Back to home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Newsletter</h1>

      <p className="mb-6">
        Subscribe to our newsletter to receive updates on our research, new
        releases, and insights on the intersection of technology, design, and
        climate impact.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4">Subscribe</h2>

        {status === "success" ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-md">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>

            {status === "error" && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md">
                {message}
              </div>
            )}
          </form>
        )}
      </div>

      <div className="prose">
        <h2 className="text-xl font-bold mb-4">Recent Newsletters</h2>
        <p>
          We&apos;ll display recent newsletters here once we start publishing
          them. Check back soon or subscribe above to get them delivered to your
          inbox.
        </p>
      </div>
    </div>
  );
}
