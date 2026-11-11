import { notFound } from "next/navigation"

import { EditorHome } from "@/components/editor/editor-home"
import { getEditorProjects } from "@/lib/project-api"

export default async function WorkspacePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const projects = await getEditorProjects()
  const project = [...projects.owned, ...projects.shared].find(({ id }) => id === projectId)
  if (!project) notFound()
  return <EditorHome ownedProjects={projects.owned} sharedProjects={projects.shared} activeProjectId={projectId} />
}
