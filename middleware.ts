import { NextRequest, NextResponse } from "next/server"
import Cookies from "js-cookie"

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const tk = request.cookies.get("token")
  const token = tk?.value
  
  const authPages = ["/login"];
  const mainPages = ["/dashboard", "/realms", '/avatar'];
  if (authPages.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } else if (mainPages.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}