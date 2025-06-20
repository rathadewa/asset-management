"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  GitPullRequest,
  SquareLibrary,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  teams: [
    {
      name: "Asset Management",
      logo: GalleryVerticalEnd,
      plan: "Dashboard",
    },
  ],
  navMain: [
    {
      title: "Asset",
      url: "/asset",
      icon: SquareLibrary,
      isActive: true,
      items: [
        {
          title: "List Asset",
          url: "/asset/list_asset",
        },
        {
          title: "Add Asset",
          url: "/asset/add_asset",
        },
      ],
    },
    {
      title: "Request",
      url: "/request",
      icon: GitPullRequest,
      isActive: true,
      items: [
        {
          title: "List Request",
          url: "/request/list_request",
        },
        {
          title: "Add Request",
          url: "/request/add_request",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="cursor-pointer">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
