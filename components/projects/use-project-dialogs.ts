"use client"

import { useState } from "react"

export type ProjectOwnership = "owned" | "shared"

export type Project = {
  id: string
  name: string
  slug: string
  ownership: ProjectOwnership
}

export type ProjectDialog = "create" | "rename" | "delete" | null

const initialProjects: Project[] = [
  { id: "project-architecture", name: "Architecture Workspace", slug: "architecture-workspace", ownership: "owned" },
  { id: "project-launch", name: "Launch Plan", slug: "launch-plan", ownership: "owned" },
  { id: "project-collaboration", name: "Collaboration Notes", slug: "collaboration-notes", ownership: "shared" },
]

export function slugifyProjectName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState(initialProjects)
  const [activeDialog, setActiveDialog] = useState<ProjectDialog>(null)
  const [projectName, setProjectName] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const selectedProject = projects.find(({ id }) => id === selectedProjectId)

  function openCreateDialog() {
    setProjectName("")
    setSelectedProjectId(null)
    setActiveDialog("create")
  }

  function openRenameDialog(project: Project) {
    setProjectName(project.name)
    setSelectedProjectId(project.id)
    setActiveDialog("rename")
  }

  function openDeleteDialog(project: Project) {
    setSelectedProjectId(project.id)
    setActiveDialog("delete")
  }

  function closeDialog() {
    if (isLoading) return
    setActiveDialog(null)
    setSelectedProjectId(null)
    setProjectName("")
  }

  async function createProject() {
    const name = projectName.trim()
    if (!name) return
    setIsLoading(true)
    await Promise.resolve()
    setProjects((currentProjects) => [...currentProjects, {
      id: `project-${Date.now()}`,
      name,
      slug: slugifyProjectName(name),
      ownership: "owned",
    }])
    setIsLoading(false)
    closeDialog()
  }

  async function renameProject() {
    const name = projectName.trim()
    if (!name || !selectedProjectId) return
    setIsLoading(true)
    await Promise.resolve()
    setProjects((currentProjects) => currentProjects.map((project) =>
      project.id === selectedProjectId ? { ...project, name, slug: slugifyProjectName(name) } : project,
    ))
    setIsLoading(false)
    closeDialog()
  }

  async function deleteProject() {
    if (!selectedProjectId) return
    setIsLoading(true)
    await Promise.resolve()
    setProjects((currentProjects) => currentProjects.filter(({ id }) => id !== selectedProjectId))
    setIsLoading(false)
    closeDialog()
  }

  return {
    activeDialog,
    closeDialog,
    createProject,
    deleteProject,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    projectName,
    projects,
    selectedProject,
    setProjectName,
    renameProject,
  }
}
