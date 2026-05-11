import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Archflow — System Design Workbench",
  description: "Visual architecture canvas with real-time packet simulation, AI analysis, and data flow visualization. Design systems that scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-[#030712] text-white font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
