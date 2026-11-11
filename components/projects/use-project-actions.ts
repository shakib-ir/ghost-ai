"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export type ProjectOwnership = "owned" | "shared"
export type Project = { id: string; name: string; slug: string; ownership: ProjectOwnership }
export type ProjectDialog = "create" | "rename" | "delete" | null

export function slugifyProjectName(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export function useProjectActions(initialProjects: Project[], activeProjectId?: string) {
  const router = useRouter()
  const [activeDialog, setActiveDialog] = useState<ProjectDialog>(null)
  const [projectName, setProjectName] = useState("")
  const [roomIdSuffix, setRoomIdSuffix] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project>()
  const [isLoading, setIsLoading] = useState(false)

  function openCreateDialog() { setProjectName(""); setRoomIdSuffix(crypto.randomUUID().slice(0, 8)); setSelectedProject(undefined); setActiveDialog("create") }
  function openRenameDialog(project: Project) { setProjectName(project.name); setSelectedProject(project); setActiveDialog("rename") }
  function openDeleteDialog(project: Project) { setSelectedProject(project); setActiveDialog("delete") }
  function closeDialog() { if (!isLoading) { setActiveDialog(null); setSelectedProject(undefined); setProjectName("") } }

  async function request(url: string, options?: RequestInit) {
    const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } })
    if (!response.ok) throw new Error("Project request failed")
    return response.status === 204 ? null : response.json()
  }

  async function createProject() {
    const name = projectName.trim()
    if (!name) return
    setIsLoading(true)
    try {
      const result = await request("/api/projects", { method: "POST", body: JSON.stringify({ id: `${slugifyProjectName(name) || "project"}-${roomIdSuffix}`, name }) }) as { project: { id: string } }
      router.push(`/editor/${result.project.id}`)
    } finally { setIsLoading(false) }
  }

  async function renameProject() {
    const name = projectName.trim()
    if (!name || !selectedProject) return
    setIsLoading(true)
    try { await request(`/api/projects/${selectedProject.id}`, { method: "PATCH", body: JSON.stringify({ name }) }); closeDialog(); router.refresh() }
    finally { setIsLoading(false) }
  }

  async function deleteProject() {
    if (!selectedProject) return
    setIsLoading(true)
    try { await request(`/api/projects/${selectedProject.id}`, { method: "DELETE" }); closeDialog(); activeProjectId === selectedProject.id ? router.push("/editor") : router.refresh() }
    finally { setIsLoading(false) }
  }

  const roomIdPreview = projectName.trim() ? `${slugifyProjectName(projectName) || "project"}-${roomIdSuffix}` : ""
  return { activeDialog, closeDialog, createProject, deleteProject, isLoading, openCreateDialog, openDeleteDialog, openRenameDialog, projectName, projects: initialProjects, roomIdPreview, selectedProject, setProjectName, renameProject }
}
