"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type ProjectSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

function EmptyProjectState() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
      No projects yet.
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-label="Project sidebar"
      aria-hidden={!isOpen}
      className={`fixed inset-y-0 left-0 top-14 z-30 flex w-72 flex-col border-r bg-card shadow-2xl transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold">Projects</h2>
        <Button aria-label="Close project sidebar" onClick={onClose} size="icon-sm" variant="ghost">
          <X />
        </Button>
      </div>

      <Tabs className="flex min-h-0 flex-1 flex-col" defaultValue="my-projects">
        <TabsList className="mx-4 mt-4 w-auto">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent className="flex min-h-0 flex-1" value="my-projects">
          <EmptyProjectState />
        </TabsContent>
        <TabsContent className="flex min-h-0 flex-1" value="shared">
          <EmptyProjectState />
        </TabsContent>
      </Tabs>

      <div className="border-t p-4">
        <Button className="w-full" variant="secondary">
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  )
}
