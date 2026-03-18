/**
 * Next.js configuration.
 *
 * Remote image patterns: only images.unsplash.com is allow-listed so that
 * Next.js Image Optimization can proxy and optimize Unsplash photos while
 * blocking requests from any other external image host.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
