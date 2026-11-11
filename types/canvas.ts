import type { Edge, Node } from "@xyflow/react"

export type CanvasNodeData = {
  label: string
  color: string
  shape: string
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">

export type CanvasEdgeData = Record<string, never>

export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">
