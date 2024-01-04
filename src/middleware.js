import { NextResponse } from 'next/server';
 
export function middleware(req, res) {
  const url = req.nextUrl.clone();
  if (url.pathname === "/api/login") {
    // res.cookies.set("token", "value-token");
  }
  if (url.pathname.includes("/api/auth")) {
    return middlewareAuth(req);
  }
  return NextResponse.next();
}

function middlewareAuth(req) {
  const headers = req.headers;
  const token = headers.get("Authorization");
  
  if (!token) {    
    req.nextUrl.pathname = "/api/_errorAuthorization";
    return NextResponse.rewrite(req.nextUrl)
  }
  return NextResponse.next();
}
export const config = {
  matcher: '/api/:path*',
}