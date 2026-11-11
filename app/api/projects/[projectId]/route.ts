import { prisma } from "@/lib/prisma"
import {
  badRequestResponse,
  forbiddenResponse,
  getAuthenticatedUserId,
  notFoundResponse,
  projectNameFromBody,
  readJsonBody,
  unauthorizedResponse,
} from "@/lib/project-api"

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>
}

async function getOwnedProject(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return { response: notFoundResponse() }
  }

  if (project.ownerId !== userId) {
    return { response: forbiddenResponse() }
  }

  return { project }
}

export async function PATCH(request: Request, context: ProjectRouteContext) {
  const userId = await getAuthenticatedUserId()

  if (!userId) {
    return unauthorizedResponse()
  }

  const { projectId } = await context.params
  const ownership = await getOwnedProject(projectId, userId)

  if (ownership.response) {
    return ownership.response
  }

  const name = projectNameFromBody(await readJsonBody(request))

  if (!name) {
    return badRequestResponse("Project name is required")
  }

  const project = await prisma.project.update({
    where: { id: ownership.project.id },
    data: { name },
  })

  return Response.json({ project })
}

export async function DELETE(_request: Request, context: ProjectRouteContext) {
  const userId = await getAuthenticatedUserId()

  if (!userId) {
    return unauthorizedResponse()
  }

  const { projectId } = await context.params
  const ownership = await getOwnedProject(projectId, userId)

  if (ownership.response) {
    return ownership.response
  }

  await prisma.project.delete({ where: { id: ownership.project.id } })

  return new Response(null, { status: 204 })
}
