import { SignUp } from "@clerk/nextjs"
import { Suspense } from "react"

import { AuthShell } from "@/components/auth/auth-shell"

export default function SignUpPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <SignUp />
      </Suspense>
    </AuthShell>
  )
}
