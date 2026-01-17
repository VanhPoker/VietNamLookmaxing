import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/shared/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Adam - AI Face Aesthetics Scorer",
  description: "AI-powered facial aesthetics analysis using advanced computer vision and machine learning. Get detailed scores, measurements, and personalized recommendations.",
  keywords: ["facial analysis", "AI", "aesthetics", "beauty", "face scanner", "lookism"],
  authors: [{ name: "Project Adam Team" }],
  openGraph: {
    title: "Project Adam - AI Face Aesthetics Scorer",
    description: "Discover your facial aesthetics score with AI-powered analysis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
