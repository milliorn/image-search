// app/manifest.ts
import { type MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Image Search",
    short_name: "Image Search",
    description: "A powerful image search tool using Unsplash API",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "./favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
        purpose: "maskable"
      },
      {
        src: "./android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "./apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
