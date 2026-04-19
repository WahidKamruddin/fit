"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { useUser, logOut } from "../auth/auth"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Settings, LogOut, Menu, X } from "lucide-react"
import { capitalize } from "@/src/app/lib/utils"
import { useSocial } from "@/src/app/providers/socialContext"
import { useMessages } from "@/src/app/providers/messagesContext"

type NavItem = { label: string; href: string; badge?: number }
type NavGroup = { label: string; items: NavItem[] }

const BASE_NAV_GROUPS: NavGroup[] = [
  {
    label: "Fashion",
    items: [
      { label: "Closet",   href: "/closet" },
      { label: "Outfits",  href: "/outfits" },
      { label: "Calendar", href: "/calendar" },
    ],
  },
  {
    label: "Social",
    items: [
      { label: "Feed",          href: "/feed" },
      { label: "Messages",      href: "/messages" },
      { label: "Notifications", href: "/notifications" },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Blog",    href: "/blog" },
      { label: "Fashion", href: "/fashion" },
    ],
  },
  {
    label: "Shop",
    items: [
      { label: "Buy", href: "/shop" },
    ],
  },
  {
    label: "Bugs",
    items: [
      { label: "Report a Bug", href: "/bugs" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "General",  href: "/settings/general" },
      { label: "Account",  href: "/settings/account" },
      { label: "Privacy",  href: "/settings/privacy" },
    ],
  },
]

export function AppNavbar() {
  const user = useUser()
  const pathname = usePathname()
  const { unreadNotifCount, currentProfile } = useSocial()
  const { totalUnread: totalUnreadMessages } = useMessages()

  // Patch badges + dynamic profile link into the Social group
  const navGroups: NavGroup[] = BASE_NAV_GROUPS.map(group => {
    if (group.label !== 'Social') return group

    const items: NavItem[] = group.items.map(item => {
      if (item.label === 'Notifications' && unreadNotifCount > 0)
        return { ...item, badge: unreadNotifCount }
      if (item.label === 'Messages' && totalUnreadMessages > 0)
        return { ...item, badge: totalUnreadMessages }
      return item
    })

    // Append the user's profile link once username is set
    if (currentProfile?.username) {
      items.push({ label: 'My Profile', href: `/profile/${currentProfile.username}` })
    }

    return { ...group, items }
  })

  const [openGroup, setOpenGroup]       = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)

  // Debounce helpers so the dropdown doesn't flicker when moving between trigger and content
  const groupTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openGroupMenu  = (label: string) => { if (groupTimer.current) clearTimeout(groupTimer.current); setOpenGroup(label) }
  const closeGroupMenu = ()              => { groupTimer.current = setTimeout(() => setOpenGroup(null), 120) }
  const openUserMenu   = ()              => { if (userTimer.current)  clearTimeout(userTimer.current);  setUserMenuOpen(true) }
  const closeUserMenu  = ()              => { userTimer.current  = setTimeout(() => setUserMenuOpen(false), 120) }

  const router = useRouter()
  const handleSignOut = async () => { await logOut(); router.push('/login') }

  const userName  = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "User"
  const avatar    = user?.user_metadata?.avatar_url ?? ""
  const firstName = capitalize(userName.split(' ')[0])
  const initials  = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  // Which group is "active" (contains the current route)
  const activeGroup = navGroups.find(g => g.items.some(i => i.href === pathname))?.label

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-off-white-100/95 backdrop-blur-md border-b border-mocha-200/50">
        <div className="h-full px-6 sm:px-10 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link
            href="/dashboard"
            className="font-cormorant text-xl font-semibold tracking-[0.25em] text-mocha-500 hover:text-mocha-400 transition-colors duration-200"
          >
            FIT.
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navGroups.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => openGroupMenu(group.label)}
                onMouseLeave={closeGroupMenu}
              >
                <button
                  className={`px-4 py-2 text-[10px] tracking-[0.4em] uppercase rounded-full transition-colors duration-200 ${
                    activeGroup === group.label || openGroup === group.label
                      ? 'text-mocha-500'
                      : 'text-mocha-300 hover:text-mocha-500'
                  }`}
                >
                  {group.label}
                </button>

                {/* Dropdown */}
                {openGroup === group.label && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-1.5 bg-white rounded-2xl border border-mocha-200/60 shadow-lg shadow-mocha-300/20 min-w-[128px]"
                    onMouseEnter={() => openGroupMenu(group.label)}
                    onMouseLeave={closeGroupMenu}
                  >
                    {/* Caret */}
                    <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-mocha-200/60 rotate-45 rounded-sm" />
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenGroup(null)}
                        className={`flex items-center justify-between px-5 py-2 text-[10px] tracking-[0.35em] uppercase transition-colors duration-150 rounded-xl mx-1 ${
                          pathname === item.href
                            ? 'text-mocha-500 bg-mocha-100/70'
                            : 'text-mocha-400 hover:text-mocha-500 hover:bg-mocha-100/50'
                        }`}
                      >
                        {item.label}
                        {item.badge && item.badge > 0 && (
                          <span className="bg-mocha-500 text-mocha-100 text-[8px] px-1.5 py-0.5 rounded-full font-medium ml-2">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Right: user pill + mobile burger ─────────────────── */}
          <div className="flex items-center gap-3">

            {/* User pill (desktop) */}
            <div
              className="relative hidden md:block"
              onMouseEnter={openUserMenu}
              onMouseLeave={closeUserMenu}
            >
              <button className="flex items-center gap-2.5 pl-3 pr-1 py-1 rounded-full border border-mocha-200/70 hover:border-mocha-300 transition-all duration-200">
                <span className="text-[10px] tracking-[0.3em] uppercase text-mocha-400">
                  {firstName}
                </span>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={avatar} alt={userName} />
                  <AvatarFallback className="bg-mocha-200 text-mocha-500 text-[10px] font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute top-full right-0 mt-2 py-1.5 bg-white rounded-2xl border border-mocha-200/60 shadow-lg shadow-mocha-300/20 min-w-[168px]"
                  onMouseEnter={openUserMenu}
                  onMouseLeave={closeUserMenu}
                >
                  <div className="px-5 pb-2 pt-1 border-b border-mocha-100 mb-1">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-500 font-semibold truncate">{userName}</p>
                  </div>
                  <Link
                    href="/settings/general"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-2 text-[10px] tracking-[0.35em] uppercase text-mocha-400 hover:text-mocha-500 hover:bg-mocha-100/50 transition-colors rounded-xl mx-1"
                  >
                    <Settings size={11} />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-5 py-2 text-[10px] tracking-[0.35em] uppercase text-mocha-400 hover:text-mocha-500 hover:bg-mocha-100/50 transition-colors text-left rounded-xl mx-1"
                  >
                    <LogOut size={11} />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-16" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-16 left-0 right-0 bg-off-white-100/98 backdrop-blur-md border-b border-mocha-200/50 pb-6 overflow-y-auto max-h-[calc(100vh-4rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User info */}
            <div className="px-8 pt-5 pb-4 border-b border-mocha-100 flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={avatar} alt={userName} />
                <AvatarFallback className="bg-mocha-200 text-mocha-500 text-[10px] font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-mocha-500 font-semibold">{userName}</p>
              </div>
            </div>

            {/* Nav groups */}
            {navGroups.map((group) => (
              <div key={group.label} className="px-8 pt-5">
                <p className="text-[9px] tracking-[0.5em] uppercase text-mocha-300 mb-2">{group.label}</p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 py-2 text-[11px] tracking-[0.3em] uppercase transition-colors duration-150 ${
                        pathname === item.href ? 'text-mocha-500' : 'text-mocha-400 hover:text-mocha-500'
                      }`}
                    >
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <span className="bg-mocha-500 text-mocha-100 text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Sign out */}
            <div className="px-8 pt-6 border-t border-mocha-100 mt-5">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-mocha-400 hover:text-mocha-500 transition-colors"
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
