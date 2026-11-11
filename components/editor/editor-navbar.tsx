"use client"

import type { ReactNode } from "react"
import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

type EditorNavbarProps = {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  children?: ReactNode
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  children,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <nav className="fixed inset-x-0 top-0 z-40 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-full items-center px-3">
        <div className="flex min-w-0 flex-1 items-center">
          <Button
            aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
            onClick={onToggleSidebar}
            size="icon"
            variant="ghost"
          >
            <SidebarIcon />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center truncate text-sm font-medium">
          {children}
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end">
          <UserButton />
        </div>
      </div>
    </nav>
  )
}
