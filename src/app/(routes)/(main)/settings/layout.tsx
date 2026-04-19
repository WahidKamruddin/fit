'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/src/app/auth/auth'
import PageSkeleton from '@/src/app/components/page-skeleton'

const settingsNav = [
  { label: 'General',  href: '/settings/general',  desc: 'Profile & bio' },
  { label: 'Account',  href: '/settings/account',  desc: 'Your preferences' },
  { label: 'Privacy',  href: '/settings/privacy',  desc: 'Notifications & data' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const user = useUser()
  const pathname = usePathname()

  if (!user) return <PageSkeleton />

  return (
    <div className="min-h-screen bg-off-white-100 pt-16">

      {/* Page header */}
      <div className="px-4 sm:px-8 lg:px-20 pt-8">
        <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Config</span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Settings</span>
        </div>
        <h1
          className="mt-3 font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
          style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', animationDelay: '0.15s' }}
        >
          Your<br />
          <span className="italic text-mocha-400">Preferences.</span>
        </h1>
        <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Body: sidebar + content */}
      <div className="px-4 sm:px-8 lg:px-20 flex flex-col md:flex-row gap-8 md:gap-16 py-8">

        {/* Sidebar */}
        <nav className="flex md:flex-col gap-1 flex-shrink-0 md:w-44 animate-fade-in" style={{ animationDelay: '0.35s' }}>
          {settingsNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col px-4 py-3 rounded-2xl transition-all duration-200 ${
                  active
                    ? 'bg-mocha-500 text-mocha-100'
                    : 'hover:bg-mocha-100/60 text-mocha-400 hover:text-mocha-500'
                }`}
              >
                <span className={`text-[10px] tracking-[0.35em] uppercase font-medium ${active ? 'text-mocha-100' : ''}`}>
                  {item.label}
                </span>
                <span className={`text-[9px] tracking-[0.2em] mt-0.5 hidden md:block ${active ? 'text-mocha-300' : 'text-mocha-300'}`}>
                  {item.desc}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
