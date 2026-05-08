import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                     request.nextUrl.pathname.startsWith("/register");

  if (!token && !isAuthPage) {
    // Não autenticado e tentando acessar página protegida
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthPage) {
    // Autenticado e tentando acessar página de login/registro
    const selectCompanyUrl = new URL("/select-company", request.url);
    return NextResponse.redirect(selectCompanyUrl);
  }

  return NextResponse.next();
}

// Proteger rotas que precisam de autenticação
export const config = {
  matcher: [
    "/board/:path*",
    "/clients/:path*",
    "/proposals/:path*",
    "/settings/:path*",
    "/team/:path*",
    "/notifications/:path*",
    "/batteries/:path*",
    "/inverters/:path*",
    "/modules/:path*",
    "/optimizers/:path*",
    "/select-company",
    "/login",
    "/register",
  ],
};
