import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for FIT. — free to get started, premium for the full wardrobe experience.',
  openGraph: {
    title: 'Pricing — FIT.',
    description: 'Simple, transparent pricing for FIT. — free to get started, premium for the full wardrobe experience.',
    url: 'https://fit-ai-closet.netlify.app/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
