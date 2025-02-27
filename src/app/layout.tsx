import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interstitial Systems",
  description:
    "Building innovative solutions at the intersection of technology and design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Umami Analytics - only loads in production */}
        {process.env.NODE_ENV === "production" && (
          <Script
            src="https://umami.tinyfactories.space/script.js"
            data-website-id="8c04a513-2d55-47d7-be4c-c9d8e5884ac0"
            defer
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} font-sans antialiased min-h-screen flex flex-col bg-white`}
      >
        <main className="">{children}</main>
      </body>
    </html>
  );
}
