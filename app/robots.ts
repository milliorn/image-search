import type { MetadataRoute } from "next";

/*
 * Represents the robots.txt configuration.
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

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
