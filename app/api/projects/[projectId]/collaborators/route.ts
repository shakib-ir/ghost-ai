import { prisma } from "@/lib/prisma"
import {
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  readJsonBody,
  unauthorizedResponse,
} from "@/lib/project-api"
import { getCurrentClerkIdentity, getProjectAccess } from "@/lib/project-access"
import { enrichCollaborators, getProjectCollaborators } from "@/lib/project-collaborators"

type CollaboratorRouteContext = {
  params: Promise<{ projectId: string }>
}

function emailFromBody(body: unknown) {
  if (!body || typeof body !== "object" || !("email" in body) || typeof body.email !== "string") {
    return null
  }

  const email = body.email.trim().toLowerCase()

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

async function getOwnerProject(projectId: string) {
  const identity = await getCurrentClerkIdentity()

  if (!identity) {
    return { response: unauthorizedResponse() }
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return { response: notFoundResponse() }
  }

  if (project.ownerId !== identity.userId) {
    return { response: forbiddenResponse() }
  }

  return { identity, project }
}

async function getAccessibleProject(projectId: string) {
  const identity = await getCurrentClerkIdentity()

  if (!identity) {
    return { response: unauthorizedResponse() }
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  })

  if (!project) {
    return { response: notFoundResponse() }
  }

  const access = await getProjectAccess(projectId, identity)

  if (!access) {
    return { response: forbiddenResponse() }
  }

  return { identity, project }
}

export async function GET(_request: Request, context: CollaboratorRouteContext) {
  const { projectId } = await context.params
  const access = await getAccessibleProject(projectId)

  if (access.response) {
    return access.response
  }

  const collaborators = await getProjectCollaborators(access.project.id)

  return Response.json({ collaborators })
}

export async function POST(request: Request, context: CollaboratorRouteContext) {
  const { projectId } = await context.params
  const access = await getOwnerProject(projectId)

  if (access.response) {
    return access.response
  }

  const email = emailFromBody(await readJsonBody(request))

  if (!email) {
    return badRequestResponse("A valid collaborator email is required")
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_collaboratorEmail: { projectId, collaboratorEmail: email } },
    select: { projectId: true },
  })

  if (existing) {
    return Response.json({ error: "Collaborator already has access" }, { status: 409 })
  }

  const collaborator = await prisma.projectCollaborator.create({
    data: { projectId, collaboratorEmail: email },
    select: { collaboratorEmail: true, createdAt: true },
  })

  const [view] = await enrichCollaborators([collaborator])

  return Response.json({ collaborator: view }, { status: 201 })
}

export async function DELETE(request: Request, context: CollaboratorRouteContext) {
  const { projectId } = await context.params
  const access = await getOwnerProject(projectId)

  if (access.response) {
    return access.response
  }

  const email = emailFromBody(await readJsonBody(request))

  if (!email) {
    return badRequestResponse("A valid collaborator email is required")
  }

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: { projectId_collaboratorEmail: { projectId, collaboratorEmail: email } },
    select: { projectId: true },
  })

  if (!collaborator) {
    return notFoundResponse()
  }

  await prisma.projectCollaborator.delete({
    where: { projectId_collaboratorEmail: { projectId, collaboratorEmail: email } },
  })

  return new Response(null, { status: 204 })
}
