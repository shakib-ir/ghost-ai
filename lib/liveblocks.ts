import { Liveblocks } from "@liveblocks/node"

const CURSOR_COLORS = [
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
] as const

type LiveblocksGlobal = typeof globalThis & {
  liveblocksClient?: Liveblocks
}

const globalForLiveblocks = globalThis as LiveblocksGlobal

export function getCursorColor(userId: string) {
  let hash = 0

  for (const character of userId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }

  return CURSOR_COLORS[hash % CURSOR_COLORS.length]
}

export function getLiveblocksClient() {
  if (globalForLiveblocks.liveblocksClient) {
    return globalForLiveblocks.liveblocksClient
  }

  const secret = process.env.LIVEBLOCKS_SECRET_KEY

  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is required to use Liveblocks.")
  }

  const client = new Liveblocks({ secret })
  globalForLiveblocks.liveblocksClient = client

  return client
}
