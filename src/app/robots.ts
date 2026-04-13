import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/bugs'],
        // Block all authenticated app routes and internals
        disallow: [
          '/dashboard',
          '/closet',
          '/outfits',
          '/calendar',
          '/blog',
          '/fashion',
          '/shop',
          '/settings',
          '/login',
          '/beta',
          '/api/',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://fit-ai-closet.netlify.app/sitemap.xml',
  }
}
