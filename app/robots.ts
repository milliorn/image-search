import { MetadataRoute } from 'next'

/*
  * Represents the robots.txt configuration.
  * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
*/

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    // sitemap: 'https://acme.com/sitemap.xml',
  }
}