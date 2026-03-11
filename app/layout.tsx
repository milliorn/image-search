/** Root layout. Applies the Inter font, global styles, and shared Footer to every page. */

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./ui/Footer";

const inter = Inter({ subsets: ["latin"] });

/** Viewport configuration for theme color and initial scale. */
const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "cyan" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** SEO and Open Graph metadata for the application. */
const metadata: Metadata = {
  title: "Image Search",
  description: "Search for images using the Unsplash API",
  generator: "Next.js",
  applicationName: "Image Search",
  keywords: [
    "image search",
    "photo search",
    "search images online",
    "find photos",
    "image gallery",
    "photo gallery",
    "photo explorer",
    "browse photos",
    "Unsplash",
    "free photos",
    "free stock photos",
    "royalty free images",
    "stock images",
    "high resolution photos",
    "HD images",
    "photo library",
    "picture search",
    "wallpapers",
    "nature photos",
    "animal photos",
    "travel photos",
    "food photography",
    "space photos",
    "sports photos",
    "art photos",
    "music photos",
  ],
  authors: [{ name: "Scott Milliorn", url: "https://milliorn.xyz/" }],
  creator: "Scott Milliorn",
  publisher: "Scott Milliorn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

/** Wraps every page with the shared HTML shell, font, and Footer. */
function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}

export { viewport, metadata };
export default RootLayout;
