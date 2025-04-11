"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Shirt,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"
import { useUser } from "../auth/auth"
import { useState } from "react"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const displayName = user ? user.displayName : "...";
  const avatar = user? user.photoURL : "/avatars/shadcn.jpg"

// This is sample data.
const data = {
  userData: {
    name: displayName,
    avatar: avatar,
  },

  navMain: [
    {
      title: "Clothes",
      url: "",
      icon: Shirt,
      isActive: true,
      items: [
        {
          title: "Clothing",
          url: "/closet",
        },
        {
          title: "Outfits",
          url: "/outfits",
        },
        {
          title: "Calendar",
          url: "/calendar",
        },
      ],
    },
    {
      title: "Library",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Blog",
          url: "#",
        },
        {
          title: "Articles",
          url: "#",
        },
        {
          title: "Fashion",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ]
}
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
