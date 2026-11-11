import { Suspense } from "react"

import { EditorHome } from "@/components/editor/editor-home"
import { getEditorProjects } from "@/lib/project-api"

// The editor reads the Clerk session and user-owned projects at request time.
// Keep this route allowed to block while the authenticated subtree is loaded.
export const instant = false

async function EditorPageContent() {
  const projects = await getEditorProjects()
  return <EditorHome ownedProjects={projects.owned} sharedProjects={projects.shared} databaseUnavailable={projects.databaseUnavailable} />
}

export default function EditorPage() {
  return (
    <Suspense fallback={null}>
      <EditorPageContent />
    </Suspense>
  )
}
