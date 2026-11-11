import { clerkClient } from "@clerk/nextjs/server"
import type { User } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export type CollaboratorView = {
  email: string
  displayName: string
  avatarUrl: string | null
  createdAt: string
}

type CollaboratorRecord = {
  collaboratorEmail: string
  createdAt: Date
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function enrichCollaborators(records: CollaboratorRecord[]): Promise<CollaboratorView[]> {
  if (!records.length) {
    return []
  }

  let users: User[] = []

  try {
    const client = await clerkClient()
    const response = await client.users.getUserList({
      emailAddress: records.map(({ collaboratorEmail }) => collaboratorEmail),
      limit: records.length,
    })
    users = response.data
  } catch (error) {
    console.error("Collaborator profiles could not be loaded from Clerk.", error)
  }

  return records.map((record) => {
    const email = normalizeEmail(record.collaboratorEmail)
    const user = users.find((candidate) =>
      candidate.emailAddresses.some((address) => normalizeEmail(address.emailAddress) === email),
    )

    return {
      email: record.collaboratorEmail,
      displayName: user?.fullName || user?.username || record.collaboratorEmail,
      avatarUrl: user?.imageUrl ?? null,
      createdAt: record.createdAt.toISOString(),
    }
  })
}

export async function getProjectCollaborators(projectId: string) {
  const records = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { collaboratorEmail: true, createdAt: true },
  })

  return enrichCollaborators(records)
}
