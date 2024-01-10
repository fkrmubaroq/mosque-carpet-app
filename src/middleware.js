import { NextResponse } from "next/server";

export async function middleware(req, res) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isMaintenance = await checkIsMaintenance();

  if (isMaintenance) {
    return NextResponse.rewrite(new URL("/maintenance", req.url));
  }

  return NextResponse.next();
}

async function checkIsMaintenance() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/setting`);
  const data = await response.json();
  return data?.data?.is_maintenance === "Y";
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|img|favicon.ico).*)',
  ],
}