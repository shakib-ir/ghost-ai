import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const signInPath = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"

async function RedirectByAuth() {
  const { isAuthenticated } = await auth()

  redirect(isAuthenticated ? "/editor" : signInPath)

  return null
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <RedirectByAuth />
    </Suspense>
  )
}
