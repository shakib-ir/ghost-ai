"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/components/projects/use-project-dialogs"

type ProjectSidebarProps = {
  isOpen: boolean
  onClose: () => void
  onCreateProject: () => void
  onDeleteProject: (project: Project) => void
  onRenameProject: (project: Project) => void
  projects: Project[]
}

function ProjectList({ projects, onDeleteProject, onRenameProject }: Pick<ProjectSidebarProps, "projects" | "onDeleteProject" | "onRenameProject">) {
  if (!projects.length) {
    return <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">No projects yet.</div>
  }

  return (
    <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
      {projects.map((project) => (
        <div className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted" key={project.id}>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{project.name}</p>
            <p className="truncate text-xs text-muted-foreground">/{project.slug}</p>
          </div>
          {project.ownership === "owned" ? (
            <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <Button aria-label={`Rename ${project.name}`} onClick={() => onRenameProject(project)} size="icon-xs" variant="ghost"><Pencil /></Button>
              <Button aria-label={`Delete ${project.name}`} onClick={() => onDeleteProject(project)} size="icon-xs" variant="ghost"><Trash2 /></Button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose, onCreateProject, onDeleteProject, onRenameProject, projects }: ProjectSidebarProps) {
  return (
    <>
      <button
        aria-label="Close project sidebar"
        className={`fixed inset-0 top-14 z-20 bg-background/60 transition-opacity md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        type="button"
      />
      <aside
        aria-hidden={!isOpen}
        aria-label="Project sidebar"
        className={`fixed inset-y-0 left-0 top-14 z-30 flex w-72 flex-col border-r bg-card shadow-2xl transition-transform duration-200 ease-out ${isOpen ? "translate-x-0" : "pointer-events-none -translate-x-full"}`}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="text-sm font-semibold">Projects</h2>
          <Button aria-label="Close project sidebar" onClick={onClose} size="icon-sm" variant="ghost"><X /></Button>
        </div>

        <Tabs className="flex min-h-0 flex-1 flex-col" defaultValue="my-projects">
          <TabsList className="mx-4 mt-4 w-auto">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent className="flex min-h-0 flex-1" value="my-projects">
            <ProjectList onDeleteProject={onDeleteProject} onRenameProject={onRenameProject} projects={projects.filter(({ ownership }) => ownership === "owned")} />
          </TabsContent>
          <TabsContent className="flex min-h-0 flex-1" value="shared">
            <ProjectList onDeleteProject={onDeleteProject} onRenameProject={onRenameProject} projects={projects.filter(({ ownership }) => ownership === "shared")} />
          </TabsContent>
        </Tabs>

        <div className="border-t p-4">
          <Button className="w-full" onClick={onCreateProject} variant="secondary"><Plus />New Project</Button>
        </div>
      </aside>
    </>
  )
}
