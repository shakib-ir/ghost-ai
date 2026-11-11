import { Suspense } from "react"
import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { EditorWorkspace } from "@/components/editor/editor-workspace"
import { getEditorProjects } from "@/lib/project-api"
import { getCurrentClerkIdentity, getProjectAccess } from "@/lib/project-access"

export const instant = false

async function WorkspacePageContent({ roomId }: { roomId: string }) {
  const identity = await getCurrentClerkIdentity()

  if (!identity) {
    redirect("/sign-in")
  }

  const project = await getProjectAccess(roomId, identity)

  if (!project) {
    return <AccessDenied />
  }

  const projects = await getEditorProjects()

  return (
    <EditorWorkspace
      ownedProjects={projects.owned}
      project={{ id: project.id, isOwner: project.isOwner, name: project.name }}
      sharedProjects={projects.shared}
    />
  )
}

export default async function WorkspacePage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params

  return (
    <Suspense fallback={null}>
      <WorkspacePageContent roomId={roomId} />
    </Suspense>
  )
}
