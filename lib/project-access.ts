import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export type CurrentClerkIdentity = {
  userId: string
  primaryEmail: string | null
}

export type AccessibleProject = {
  id: string
  name: string
  ownerId: string
  isOwner: boolean
}

export async function getCurrentClerkIdentity(): Promise<CurrentClerkIdentity | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await currentUser()

  return {
    userId,
    primaryEmail: user?.primaryEmailAddress?.emailAddress ?? null,
  }
}

function isDatabaseConnectionFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)

  return [
    "ECONNREFUSED",
    "fetch failed",
    "HTTP connection string",
    "P6001",
    "PrismaClientInitializationError",
  ].some((fragment) => message.includes(fragment))
}

export async function getProjectAccess(
  roomId: string,
  identity: CurrentClerkIdentity | null,
): Promise<AccessibleProject | null> {
  if (!identity) {
    return null
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: roomId,
        OR: [
          { ownerId: identity.userId },
          ...(identity.primaryEmail
            ? [{ collaborators: { some: { collaboratorEmail: identity.primaryEmail } } }]
            : []),
        ],
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
      },
    })

    return project
      ? { ...project, isOwner: project.ownerId === identity.userId }
      : null
  } catch (error) {
    if (!isDatabaseConnectionFailure(error)) {
      throw error
    }

    console.error("Project access could not be checked because the database is unavailable.")
    return null
  }
}
