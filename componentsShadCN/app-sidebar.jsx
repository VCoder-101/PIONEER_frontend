"use client"

import * as React from "react"

import { NavMain } from "@/componentsShadCN/nav-main"
import { NavProjects } from "@/componentsShadCN/nav-projects"
import { NavUser } from "@/componentsShadCN/nav-user"
import { TeamSwitcher } from "@/componentsShadCN/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/componentsShadCN/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Управление услугами",
      url: "#",
      icon: (
        <TerminalSquareIcon />
      ),
      isActive: true,
      items: [
        {
          title: "Детейлинг",
          url: "#",
        },
        {
          title: "Подключить услугу",
          url: "#",
        },
      ],
    },
    {
      title: "Записи",
      url: "#",
      icon: (
        <BookOpenIcon />
      ),
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
      icon: (
        <Settings2Icon />
      ),
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
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon />
      ),
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar className={'bg-white'} collapsible="icon" {...props}>
      <div className={'bg-white h-full'}>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </div>
    </Sidebar>
  );
}
