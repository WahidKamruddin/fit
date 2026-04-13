import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Report a Bug',
  description: 'Found something broken in FIT.? Let us know and we\'ll fix it.',
  openGraph: {
    title: 'Report a Bug — FIT.',
    description: 'Found something broken in FIT.? Let us know and we\'ll fix it.',
    url: 'https://fit-ai-closet.netlify.app/bugs',
  },
  robots: { index: false }, // no SEO value in a bug report page
}

export default function BugsLayout({ children }: { children: React.ReactNode }) {
  return children
}
