import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nauka",
  description: "Frontend-only interactive demonstration prototype",
  openGraph: {
    title: "Nauka",
    description: "Maritime Fleet Optimization Prototype",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-black text-white h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-foreground selection:bg-accent-orange/30">
        {children}
      </body>
    </html>
  );
}
