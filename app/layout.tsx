'use client';

import { PlasmicRootProvider } from '@plasmicapp/loader-nextjs';
import { PLASMIC } from '@/lib/plasmic-init';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        <PlasmicRootProvider loader={PLASMIC}>
          {children}
        </PlasmicRootProvider>
      </body>
    </html>
  );
}
