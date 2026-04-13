import Contact from "@/src/app/components/contact";
import Hero from "@/src/app/components/hero";
import Timeline from "@/src/app/components/timeline";
import Outfits from "@/src/app/components/ai-outfit-feature";
import Wardrobe from "@/src/app/components/wardrobe";
import Shop from "@/src/app/components/shop";
import Navbar from "@/src/app/components/navbar";
import Footer from "@/src/app/components/footer";
import Faq from "@/src/app/components/faq";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FIT. — Your AI Wardrobe',
  description: 'Curate, organise and style your wardrobe with AI. Build outfits, plan your week, and dress for every version of you.',
  alternates: {
    canonical: 'https://fit-ai-closet.netlify.app',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FIT.',
  url: 'https://fit-ai-closet.netlify.app',
  description: 'AI-powered wardrobe management app. Curate your closet, build outfits, and plan your week with intelligent styling suggestions.',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Wahid Kamruddin',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <Navbar/>
        <Hero/>
        <Wardrobe/>
        <Outfits/>
        <Shop/>
        <Timeline/>
        <Faq/>
        <Contact/>
        <Footer/>
      </div>
    </>
  )
}
