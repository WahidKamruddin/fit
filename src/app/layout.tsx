import '@/src/app/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FIT',
  description: 'Curated Outfits',
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
