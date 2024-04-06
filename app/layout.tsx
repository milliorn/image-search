import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./ui/Footer";

/**
 * Initializes the Inter font with the specified subsets.
 * @param {Object} options - The options for initializing the Inter font.
 * @param {string[]} options.subsets - The subsets of the Inter font to include.
 * @returns {Inter} The initialized Inter font object.
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Represents the viewport configuration.
 * https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "cyan" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Represents the metadata for the Image Search application.
 */
export const metadata: Metadata = {
  /**
   * The title of the application.
   */
  title: "Image Search",

  /**
   * The description of the application.
   */
  description: "Search for images using the Unsplash API",

  /**
   * The generator used to build the application.
   */
  generator: "Next.js",

  /**
   * The name of the application.
   */
  applicationName: "Image Search",

  /**
   * The keywords associated with the application.
   */
  keywords: [
    "image search",
    "Next.js application",
    "React",
    "react-dom",
    "react-spinners",
    "web development",
    "modern web app",
    "Next.js 14",
    "React 18",
    "UI/UX",
    "tailwindcss",
    "responsive design",
    "frontend development",
    "JavaScript",
    "TypeScript",
    "SEO friendly",
    "performance optimized",
    "ESLint",
    "code quality",
    "development tools",
    "node.js",
    "image gallery",
    "photo explorer",
    "visual content",
    "web app",
    "image API",
    "Unsplash integration",
  ],

  /**
   * The authors of the application.
   */
  authors: [{ name: "Scott Milliorn", url: "https://milliorn.xyz/" }],

  /**
   * The creator of the application.
   */
  creator: "Scott Milliorn",

  /**
   * The publisher of the application.
   */
  publisher: "Scott Milliorn",

  /**
   * The format detection settings for the application.
   */
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

  robots: {
    index: false,
    follow: false,
  },

/**
 * Root layout component.
 *
 * @param children - The child components to render.
 * @returns The rendered root layout.
 */
export default function RootLayout({
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
