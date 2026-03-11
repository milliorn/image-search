/** Sitemap listing all public URLs for search engine indexing. */

import type { MetadataRoute } from "next";

function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://image-search-milliorn.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}

export default sitemap;
