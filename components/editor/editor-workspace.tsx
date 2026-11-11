"use client"

import { PanelRightClose, PanelRightOpen, Share2 } from "lucide-react"
import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { useShareDialog } from "@/components/editor/use-share-dialog"
import { ProjectDialogs } from "@/components/projects/project-dialogs"
import { useProjectActions, type Project } from "@/components/projects/use-project-actions"
import { Button } from "@/components/ui/button"

type EditorWorkspaceProps = {
  project: Pick<Project, "id" | "name"> & { isOwner: boolean }
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function EditorWorkspace({ project, ownedProjects, sharedProjects }: EditorWorkspaceProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
  const actions = useProjectActions([...ownedProjects, ...sharedProjects], project.id)
  const share = useShareDialog(project.id)
  const AiSidebarIcon = isAiSidebarOpen ? PanelRightClose : PanelRightOpen

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <EditorNavbar
        actions={
          <div className="flex items-center gap-1">
            <Button aria-label="Share project" onClick={share.openDialog} size="sm" title="Share project" variant="ghost">
              <Share2 />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              aria-label={isAiSidebarOpen ? "Hide AI sidebar" : "Show AI sidebar"}
              aria-pressed={isAiSidebarOpen}
              onClick={() => setIsAiSidebarOpen((open) => !open)}
              size="icon"
              title={isAiSidebarOpen ? "Hide AI sidebar" : "Show AI sidebar"}
              variant="ghost"
            >
              <AiSidebarIcon />
            </Button>
          </div>
        }
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      >
        {project.name}
      </EditorNavbar>

      <div className="flex min-h-0 flex-1 pt-14">
        <ProjectSidebar
          activeProjectId={project.id}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={actions.openCreateDialog}
          onDeleteProject={actions.openDeleteDialog}
          onRenameProject={actions.openRenameDialog}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
        />

        <main className="flex min-w-0 flex-1">
          <section aria-label="Editor canvas" className="flex min-w-0 flex-1 items-center justify-center bg-background px-6">
            <div className="max-w-md space-y-2 text-center">
              <h1 className="text-lg font-semibold">Canvas coming soon</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Your project workspace is ready. The interactive canvas will appear here.
              </p>
            </div>
          </section>

          {isAiSidebarOpen ? (
            <aside aria-label="AI sidebar" className="hidden w-80 shrink-0 flex-col border-l bg-card md:flex">
              <div className="border-b px-4 py-3">
                <h2 className="text-sm font-semibold">AI assistant</h2>
              </div>
              <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
                AI chat will appear here.
              </div>
            </aside>
          ) : null}
        </main>
      </div>

      <ProjectDialogs {...actions} />
      <ShareDialog
        collaborators={share.collaborators}
        copied={share.copied}
        email={share.email}
        error={share.error}
        isLoading={share.isLoading}
        isOpen={share.isOpen}
        isOwner={project.isOwner}
        onChangeEmail={share.setEmail}
        onClose={share.closeDialog}
        onCopyLink={share.copyProjectLink}
        onInvite={share.inviteCollaborator}
        onOpenChange={(open) => open ? share.openDialog() : share.closeDialog()}
        onRemove={share.removeCollaborator}
        pendingEmail={share.pendingEmail}
      />
    </div>
  )
}
