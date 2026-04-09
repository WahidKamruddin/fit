"use client"

import * as React from "react"
import {
  BookOpen,
  Settings,
  Shirt,
  ShoppingCart,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./nav-dashboard"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"
import { useUser } from "../auth/auth"

const navMain = [
  {
    title: "Fashion",
    url: "",
    icon: Shirt,
    isActive: true,
    items: [
      { title: "Closet", url: "/closet" },
      { title: "Outfits", url: "/outfits" },
      { title: "Calendar", url: "/calendar" },
    ],
  },
  {
    title: "Library",
    url: "",
    icon: BookOpen,
    items: [
      { title: "Blog", url: "/blog" },
      { title: "Fashion", url: "/fashion" },
    ],
  },
  {
    title: "Shop",
    url: "",
    icon: ShoppingCart,
    items: [
      { title: "Buy", url: "/shop" },
      { title: "Sell", url: "/shop" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "General", url: "settings/general" },
      { title: "Account", url: "#" },
      { title: "Privacy", url: "#" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

  const userData = {
    name: user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "...",
    avatar: user?.user_metadata?.avatar_url ?? "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
