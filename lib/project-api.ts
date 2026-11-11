import { auth } from "@clerk/nextjs/server"
import { currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export type EditorProject = {
  id: string
  name: string
  slug: string
  ownership: "owned" | "shared"
}

export async function getAuthenticatedUserId() {
  const { userId } = await auth()

  return userId
}

export async function getEditorProjects() {
  const userId = await getAuthenticatedUserId()

  if (!userId) {
    return { owned: [], shared: [], databaseUnavailable: false } satisfies { owned: EditorProject[]; shared: EditorProject[]; databaseUnavailable: boolean }
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress
  let projects
  try {
    projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          ...(email ? [{ collaborators: { some: { collaboratorEmail: email } } }] : []),
        ],
      },
      include: { collaborators: true },
      orderBy: { updatedAt: "desc" },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const isConnectionFailure = [
      "ECONNREFUSED",
      "fetch failed",
      "HTTP connection string",
      "P6001",
      "PrismaClientInitializationError",
    ].some((fragment) => message.includes(fragment))
    if (!isConnectionFailure) throw error
    console.error("Project database is unavailable; rendering the editor with an empty project list.", message)
    return { owned: [], shared: [], databaseUnavailable: true }
  }

  const mapProject = (project: (typeof projects)[number], ownership: EditorProject["ownership"]): EditorProject => ({
    id: project.id,
    name: project.name,
    slug: project.id,
    ownership,
  })

  return {
    owned: projects.filter((project) => project.ownerId === userId).map((project) => mapProject(project, "owned")),
    shared: projects.filter((project) => project.ownerId !== userId).map((project) => mapProject(project, "shared")),
    databaseUnavailable: false,
  }
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}

export function forbiddenResponse() {
  return Response.json({ error: "Forbidden" }, { status: 403 })
}

export function notFoundResponse() {
  return Response.json({ error: "Project not found" }, { status: 404 })
}

export function badRequestResponse(message: string) {
  return Response.json({ error: message }, { status: 400 })
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export function projectNameFromBody(body: unknown, fallback?: string) {
  if (!body || typeof body !== "object" || !("name" in body)) {
    return fallback
  }

  const name = body.name

  if (typeof name !== "string") {
    return null
  }

  const trimmedName = name.trim()

  return trimmedName || fallback || null
}

export function projectIdFromBody(body: unknown) {
  if (!body || typeof body !== "object" || !("id" in body)) return undefined

  const id = body.id
  return typeof id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ? id : null
}
