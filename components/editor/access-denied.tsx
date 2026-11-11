import { Lock } from "lucide-react"
import Link from "next/link"

export function AccessDenied() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border bg-card text-muted-foreground">
          <Lock aria-hidden="true" className="size-5" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Access denied</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This project does not exist or you do not have access to it.
          </p>
        </div>
        <Link className="text-sm font-medium underline-offset-4 hover:underline" href="/editor">
          Back to editor
        </Link>
      </div>
    </main>
  )
}
