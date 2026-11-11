"use client"

import type { FormEvent } from "react"
import { Copy, Mail, Trash2 } from "lucide-react"

import { EditorDialogContent } from "@/components/editor/editor-dialog"
import type { ShareCollaborator } from "@/components/editor/use-share-dialog"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ShareDialogProps = {
  collaborators: ShareCollaborator[]
  copied: boolean
  email: string
  error?: string
  isLoading: boolean
  isOpen: boolean
  isOwner: boolean
  onChangeEmail: (email: string) => void
  onClose: () => void
  onCopyLink: () => Promise<void>
  onInvite: () => Promise<void>
  onOpenChange: (open: boolean) => void
  onRemove: (email: string) => Promise<void>
  pendingEmail?: string
}

export function ShareDialog({ collaborators, copied, email, error, isLoading, isOpen, isOwner, onChangeEmail, onClose, onCopyLink, onInvite, onOpenChange, onRemove, pendingEmail }: ShareDialogProps) {
  function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void onInvite()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <EditorDialogContent
        description={isOwner ? "Invite people to collaborate on this project." : "You have access to this project as a collaborator."}
        footer={
          <Button onClick={onClose} type="button" variant="ghost">
            Done
          </Button>
        }
        title="Share project"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">Project link</p>
              <p className="text-xs text-muted-foreground">Copy the current workspace link to share it.</p>
            </div>
            <Button disabled={copied} onClick={() => void onCopyLink()} size="sm" variant="outline">
              <Copy />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {isOwner ? (
            <form className="flex items-end gap-2" onSubmit={submitInvite}>
              <div className="min-w-0 flex-1 space-y-2">
                <label className="text-sm font-medium" htmlFor="collaborator-email">Invite by email</label>
                <Input autoComplete="email" id="collaborator-email" onChange={(event) => onChangeEmail(event.target.value)} placeholder="teammate@example.com" type="email" value={email} />
              </div>
              <Button disabled={isLoading || !email.trim()} type="submit">
                <Mail />
                Invite
              </Button>
            </form>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Collaborators</h2>
              <span className="text-xs text-muted-foreground">{collaborators.length}</span>
            </div>
            {isLoading && !collaborators.length ? (
              <p className="text-sm text-muted-foreground">Loading collaborators…</p>
            ) : collaborators.length ? (
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div className="flex items-center gap-3 rounded-lg border px-3 py-2" key={collaborator.email}>
                    {collaborator.avatarUrl ? (
                      // Clerk supplies the remote avatar URL.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="" className="size-8 rounded-full object-cover" src={collaborator.avatarUrl} />
                    ) : (
                      <div aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                        {collaborator.displayName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{collaborator.displayName}</p>
                      <p className="truncate text-xs text-muted-foreground">{collaborator.email}</p>
                    </div>
                    {isOwner ? (
                      <Button aria-label={`Remove ${collaborator.email}`} disabled={pendingEmail === collaborator.email} onClick={() => void onRemove(collaborator.email)} size="icon-sm" variant="ghost">
                        <Trash2 />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No collaborators yet.</p>
            )}
          </div>

          {error ? <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
        </div>
      </EditorDialogContent>
    </Dialog>
  )
}
