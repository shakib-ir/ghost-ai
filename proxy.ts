import { clerkMiddleware } from "@clerk/nextjs/server"
import type { NextRequest } from "next/server"

function pathFromRoute(value: string | undefined, fallback: string) {
  if (!value) return fallback

  try {
    return new URL(value, "http://localhost").pathname
  } catch {
    return value
  }
}

const signInPath = pathFromRoute(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  "/sign-in",
)
const signUpPath = pathFromRoute(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  "/sign-up",
)

function isPublicRoute(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  return [signInPath, signUpPath].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
}
