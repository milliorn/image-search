import { MetadataRoute } from 'next'

/*
  * Represents the sitemap for the Image Search application.
  * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
*/
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://image-search-milliorn.vercel.app/',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}