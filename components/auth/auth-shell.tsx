import type { ReactNode } from "react"

type AuthShellProps = {
  children: ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)]">
      <section className="hidden border-r bg-card lg:flex lg:items-center lg:px-16">
        <div className="max-w-md space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted-foreground">
              GHOST AI
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              A quiet workspace for bold ideas.
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Bring your projects, prompts, and creative process into one focused editor.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Organize every project in one place.</li>
            <li>Shape ideas with a distraction-free editor.</li>
            <li>Share work with the people who matter.</li>
          </ul>
        </div>
      </section>
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  )
}
