"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/projects/project-dialogs"
import { useProjectActions, type Project } from "@/components/projects/use-project-actions"
import { Button } from "@/components/ui/button"

export function EditorHome({ ownedProjects, sharedProjects, activeProjectId, databaseUnavailable = false }: { ownedProjects: Project[]; sharedProjects: Project[]; activeProjectId?: string; databaseUnavailable?: boolean }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const actions = useProjectActions([...ownedProjects, ...sharedProjects], activeProjectId)
  return <div className="min-h-screen bg-background">
    <EditorNavbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((open) => !open)}>Ghost AI</EditorNavbar>
    <ProjectSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onCreateProject={actions.openCreateDialog} onDeleteProject={actions.openDeleteDialog} onRenameProject={actions.openRenameDialog} ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
    <main className="flex min-h-screen items-center justify-center px-6 pt-14"><div className="max-w-lg space-y-6 text-center">{databaseUnavailable ? <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">Project storage is unavailable. Start the local Prisma Postgres server, then refresh.</p> : null}<div className="space-y-3"><h1 className="text-2xl font-semibold tracking-tight">{activeProjectId ? "Workspace ready" : "Create a project or open an existing one"}</h1><p className="text-sm leading-6 text-muted-foreground">{activeProjectId ? "Your project workspace is ready for the editor." : "Start a new architecture workspace, or choose a project from the sidebar."}</p></div><Button disabled={databaseUnavailable} onClick={actions.openCreateDialog}><Plus />New Project</Button></div></main>
    <ProjectDialogs {...actions} />
  </div>
}
