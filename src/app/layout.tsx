import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rhemson Tax - Nigerian Tax Calculator",
  description: "Calculate your Nigerian taxes accurately for 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}