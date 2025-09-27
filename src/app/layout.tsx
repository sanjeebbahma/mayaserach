import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Maya Search Engine - Fast, Private & Comprehensive Web Search",
  description: "Maya Search Engine provides fast, private, and comprehensive web search results. Search the web with advanced filtering, image search, video search, and more. Your privacy-focused search engine.",
  keywords: "search engine, web search, Maya search, private search, fast search, image search, video search",
  authors: [{ name: "Maya Search Engine" }],
  robots: "index, follow",
  openGraph: {
    title: "Maya Search Engine - Fast, Private & Comprehensive Web Search",
    description: "Maya Search Engine provides fast, private, and comprehensive web search results. Search the web with advanced filtering, image search, video search, and more.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maya Search Engine - Fast, Private & Comprehensive Web Search",
    description: "Maya Search Engine provides fast, private, and comprehensive web search results. Search the web with advanced filtering, image search, video search, and more.",
  },
};

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
        {children}
      </body>
    </html>
  );
}
