import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const allCookies = request.cookies.getAll();

  const supabaseCookie = allCookies.find((cookie) =>
    cookie.name.startsWith("sb-"),
  );
  const isLoggedIn = !!supabaseCookie;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isProtectedPage =
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/cart") ||
    request.nextUrl.pathname.startsWith("/myorders") ||
    request.nextUrl.pathname.startsWith("/wishlist");
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/sign-up',
    '/profile/:path*',
    '/settings/:path*',
    '/cart/:path*',
    '/myorders/:path*',
    '/wishlist/:path*'
  ],
};
