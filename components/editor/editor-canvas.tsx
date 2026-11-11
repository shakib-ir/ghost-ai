"use client"

import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useErrorListener,
} from "@liveblocks/react/suspense"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
} from "@xyflow/react"
import { useState } from "react"

import type { CanvasEdge, CanvasNode } from "@/types/canvas"

import "@xyflow/react/dist/style.css"

function CanvasLoading() {
  return (
    <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
      Loading canvas…
    </div>
  )
}

function CanvasError() {
  return (
    <div className="flex h-full items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
      The collaborative canvas could not connect. Please try again later.
    </div>
  )
}

function LiveblocksErrorListener({ onError }: { onError: () => void }) {
  useErrorListener(() => onError())

  return null
}

function CollaborativeCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    edges: { initial: [] },
    nodes: { initial: [] },
    suspense: true,
  })

  return (
    <ReactFlow
      connectionMode={ConnectionMode.Loose}
      edges={edges}
      fitView
      nodes={nodes}
      onConnect={onConnect}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
    >
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  )
}

export function EditorCanvas({ roomId }: { roomId: string }) {
  const [hasConnectionError, setHasConnectionError] = useState(false)

  return (
    <div className="h-full w-full">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{
            cursor: null,
            isThinking: false,
          }}
        >
          <LiveblocksErrorListener onError={() => setHasConnectionError(true)} />
          {hasConnectionError ? (
            <CanvasError />
          ) : (
            <ClientSideSuspense fallback={<CanvasLoading />}>
              {() => <CollaborativeCanvas />}
            </ClientSideSuspense>
          )}
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  )
}
