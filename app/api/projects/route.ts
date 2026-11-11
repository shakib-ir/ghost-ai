import { prisma } from "@/lib/prisma"
import {
  badRequestResponse,
  getAuthenticatedUserId,
  projectIdFromBody,
  projectNameFromBody,
  readJsonBody,
  unauthorizedResponse,
} from "@/lib/project-api"

export async function GET() {
  const userId = await getAuthenticatedUserId()

  if (!userId) {
    return unauthorizedResponse()
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })

  return Response.json({ projects })
}

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId()

  if (!userId) {
    return unauthorizedResponse()
  }

  const body = await readJsonBody(request)
  const name = projectNameFromBody(body, "Untitled Project")
  const id = projectIdFromBody(body)

  if (!name) {
    return badRequestResponse("Project name must be a string")
  }

  if (id === null) {
    return badRequestResponse("Project ID must be a valid room ID")
  }

  const project = await prisma.project.create({
    data: {
      ...(id ? { id } : {}),
      ownerId: userId,
      name,
    },
  })

  return Response.json({ project }, { status: 201 })
}
