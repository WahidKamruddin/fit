import '@/src/app/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://fit-ai-closet.netlify.app'),
  title: {
    default: 'FIT — Your AI Wardrobe',
    template: '%s | FIT',
  },
  description: 'Curate, organize and style your wardrobe with AI. Build outfits, plan your week, and dress for every version of you.',
  openGraph: {
    title: 'FIT. — Your AI Wardrobe',
    description: 'Curate, organise and style your wardrobe with AI. Build outfits, plan your week, and dress for every version of you.',
    url: 'https://fit-ai-closet.netlify.app',
    siteName: 'FIT.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIT. — Your AI Wardrobe',
    description: 'Curate, organise and style your wardrobe with AI. Build outfits, plan your week, and dress for every version of you.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="scroll-smooth snap-y snap-proximity bg-mocha-500" lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
