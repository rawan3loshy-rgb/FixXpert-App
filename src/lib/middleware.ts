import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {

    const session = req.cookies.get("admin_session")

    if (!session) {
      return NextResponse.redirect(new URL("/admin/lock", req.url))
    }
  }

  return NextResponse.next()
}