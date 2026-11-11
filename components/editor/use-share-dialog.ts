"use client"

import { useState } from "react"

export type ShareCollaborator = {
  email: string
  displayName: string
  avatarUrl: string | null
  createdAt: string
}

type CollaboratorResponse = {
  collaborators: ShareCollaborator[]
}

type AddedCollaboratorResponse = {
  collaborator: ShareCollaborator
}

export function useShareDialog(projectId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [collaborators, setCollaborators] = useState<ShareCollaborator[]>([])
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string>()
  const [error, setError] = useState<string>()
  const [copied, setCopied] = useState(false)

  async function request<T>(options?: RequestInit) {
    const response = await fetch(`/api/projects/${projectId}/collaborators`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    })
    const payload = await response.json().catch(() => null) as { error?: string } | null

    if (!response.ok) {
      throw new Error(payload?.error ?? "Share request failed")
    }

    return payload as T
  }

  async function loadCollaborators() {
    setIsLoading(true)
    setError(undefined)

    try {
      const result = await request<CollaboratorResponse>()
      setCollaborators(result.collaborators)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load collaborators")
    } finally {
      setIsLoading(false)
    }
  }

  function openDialog() {
    setIsOpen(true)
    void loadCollaborators()
  }

  function closeDialog() {
    if (!isLoading) {
      setIsOpen(false)
      setError(undefined)
      setEmail("")
    }
  }

  async function inviteCollaborator() {
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const result = await request<AddedCollaboratorResponse>({
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail }),
      })
      setCollaborators((current) => [...current, result.collaborator])
      setEmail("")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to invite collaborator")
    } finally {
      setIsLoading(false)
    }
  }

  async function removeCollaborator(collaboratorEmail: string) {
    setPendingEmail(collaboratorEmail)
    setError(undefined)

    try {
      await request({ method: "DELETE", body: JSON.stringify({ email: collaboratorEmail }) })
      setCollaborators((current) => current.filter(({ email: currentEmail }) => currentEmail !== collaboratorEmail))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to remove collaborator")
    } finally {
      setPendingEmail(undefined)
    }
  }

  async function copyProjectLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setError("Unable to copy the project link")
    }
  }

  return {
    closeDialog,
    collaborators,
    copied,
    copyProjectLink,
    email,
    error,
    inviteCollaborator,
    isLoading,
    isOpen,
    openDialog,
    pendingEmail,
    removeCollaborator,
    setEmail,
  }
}
