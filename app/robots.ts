/** Robots.txt configuration allowing all crawlers on public routes. */

import type { MetadataRoute } from "next";

function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
  };
}

export default robots;
