import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maritime Fleet Optimization Platform",
  description: "Frontend-only interactive demonstration prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} dark bg-black text-white h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-foreground selection:bg-accent-orange/30">
        {children}
      </body>
    </html>
  );
}
