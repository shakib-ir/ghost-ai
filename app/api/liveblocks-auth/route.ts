import { getCursorColor, getLiveblocksClient } from "@/lib/liveblocks"
import { getCurrentClerkIdentity, getProjectAccess } from "@/lib/project-access"

function badRequestResponse() {
  return Response.json({ error: "A Liveblocks room ID is required" }, { status: 400 })
}

function roomIdFromBody(body: unknown) {
  if (!body || typeof body !== "object" || !("room" in body)) {
    return null
  }

  const room = body.room

  return typeof room === "string" && room.trim() ? room.trim() : null
}

export async function POST(request: Request) {
  const identity = await getCurrentClerkIdentity()

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return badRequestResponse()
  }

  const roomId = roomIdFromBody(body)

  if (!roomId) {
    return badRequestResponse()
  }

  const project = await getProjectAccess(roomId, identity)

  if (!project) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const liveblocks = getLiveblocksClient()

  await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: [],
  })

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: {
      name: identity.displayName,
      avatar: identity.avatarUrl ?? "",
      color: getCursorColor(identity.userId),
    },
  })

  session.allow(roomId, ["*:write"])

  const { body: sessionBody, status } = await session.authorize()

  return new Response(sessionBody, { status })
}
