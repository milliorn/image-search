/** Sitemap listing all public URLs for search engine indexing. */

import type { MetadataRoute } from "next";

const SITE_URL =
  process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://image-search-black-iota.vercel.app";

function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}

export default sitemap;
