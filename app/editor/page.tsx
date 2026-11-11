"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/projects/project-dialogs"
import { useProjectDialogs } from "@/components/projects/use-project-dialogs"
import { Button } from "@/components/ui/button"

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const projectDialogs = useProjectDialogs()

  return (
    <div className="min-h-screen bg-background">
      <EditorNavbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((open) => !open)}>
        Ghost AI
      </EditorNavbar>
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreateProject={projectDialogs.openCreateDialog}
        onDeleteProject={projectDialogs.openDeleteDialog}
        onRenameProject={projectDialogs.openRenameDialog}
        projects={projectDialogs.projects}
      />
      <main className="flex min-h-screen items-center justify-center px-6 pt-14">
        <div className="max-w-lg space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">Create a project or open an existing one</h1>
            <p className="text-sm leading-6 text-muted-foreground">Start a new architecture workspace, or choose a project from the sidebar.</p>
          </div>
          <Button onClick={projectDialogs.openCreateDialog}><Plus />New Project</Button>
        </div>
      </main>
      <ProjectDialogs
        activeDialog={projectDialogs.activeDialog}
        closeDialog={projectDialogs.closeDialog}
        createProject={projectDialogs.createProject}
        deleteProject={projectDialogs.deleteProject}
        isLoading={projectDialogs.isLoading}
        projectName={projectDialogs.projectName}
        renameProject={projectDialogs.renameProject}
        selectedProject={projectDialogs.selectedProject}
        setProjectName={projectDialogs.setProjectName}
      />
    </div>
  )
}
