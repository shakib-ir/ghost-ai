"use client"

import type { FormEvent } from "react"

import { EditorDialogContent } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { type Project, type ProjectDialog } from "@/components/projects/use-project-actions"

type ProjectDialogsProps = {
  activeDialog: ProjectDialog
  closeDialog: () => void
  createProject: () => Promise<void>
  deleteProject: () => Promise<void>
  isLoading: boolean
  projectName: string
  roomIdPreview: string
  selectedProject?: Project
  setProjectName: (name: string) => void
  renameProject: () => Promise<void>
}

export function ProjectDialogs({ activeDialog, closeDialog, createProject, deleteProject, isLoading, projectName, roomIdPreview, selectedProject, setProjectName, renameProject }: ProjectDialogsProps) {
  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void createProject()
  }

  function submitRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void renameProject()
  }

  return (
    <>
      <Dialog open={activeDialog === "create"} onOpenChange={(open) => !open && closeDialog()}>
        <EditorDialogContent
          title="Create Project"
          description="Start a new architecture workspace."
          footer={<>
            <Button disabled={isLoading} onClick={closeDialog} type="button" variant="ghost">Cancel</Button>
            <Button disabled={isLoading || !projectName.trim()} form="create-project-form" type="submit">{isLoading ? "Creating…" : "Create Project"}</Button>
          </>}
        >
          <form className="space-y-4" id="create-project-form" onSubmit={submitCreate}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="create-project-name">Project name</label>
              <Input autoFocus id="create-project-name" onChange={(event) => setProjectName(event.target.value)} placeholder="Architecture Workspace" value={projectName} />
            </div>
            <p className="text-sm text-muted-foreground">Room ID preview: <span className="font-mono text-foreground">{roomIdPreview || "—"}</span></p>
          </form>
        </EditorDialogContent>
      </Dialog>

      <Dialog open={activeDialog === "rename"} onOpenChange={(open) => !open && closeDialog()}>
        <EditorDialogContent
          title="Rename Project"
          description={`Current project: ${selectedProject?.name ?? "—"}`}
          footer={<>
            <Button disabled={isLoading} onClick={closeDialog} type="button" variant="ghost">Cancel</Button>
            <Button disabled={isLoading || !projectName.trim()} form="rename-project-form" type="submit">{isLoading ? "Saving…" : "Save Name"}</Button>
          </>}
        >
          <form className="space-y-4" id="rename-project-form" onSubmit={submitRename}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="rename-project-name">Project name</label>
              <Input autoFocus id="rename-project-name" onChange={(event) => setProjectName(event.target.value)} value={projectName} />
            </div>
          </form>
        </EditorDialogContent>
      </Dialog>

      <Dialog open={activeDialog === "delete"} onOpenChange={(open) => !open && closeDialog()}>
        <EditorDialogContent
          title="Delete Project"
          description={`Delete “${selectedProject?.name ?? "this project"}”? This action cannot be undone.`}
          footer={<>
            <Button disabled={isLoading} onClick={closeDialog} type="button" variant="ghost">Cancel</Button>
            <Button disabled={isLoading} onClick={() => void deleteProject()} type="button" variant="destructive">{isLoading ? "Deleting…" : "Delete Project"}</Button>
          </>}
        />
      </Dialog>
    </>
  )
}
