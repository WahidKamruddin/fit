"use client"

import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import Link from "next/link"

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard" className="flex items-center gap-3">
            {/* Monogram badge */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex-shrink-0">
              <span className="font-cormorant text-sm font-semibold tracking-wide leading-none" style={{ color: '#E9DDC8' }}>F</span>
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="font-cormorant text-base font-semibold tracking-[0.15em] text-sidebar-foreground truncate">
                FIT.
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-sidebar-ring truncate">
                Wardrobe
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
