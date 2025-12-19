'use client';

import { PlasmicRootProvider } from '@plasmicapp/loader-nextjs';
import { PLASMIC } from '@/lib/plasmic-init';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EnvErrorBoundary } from './components/EnvErrorBoundary';

// Validate environment variables on app startup
// This will throw an error if any required variables are missing
// The EnvErrorBoundary will catch and display these errors gracefully
import '@/lib/env';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EnvErrorBoundary>
          <PlasmicRootProvider loader={PLASMIC}>
            {children}
          </PlasmicRootProvider>
        </EnvErrorBoundary>
      </body>
    </html>
  );
}
