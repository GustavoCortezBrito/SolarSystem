import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("🔐 Middleware - Path:", req.nextUrl.pathname);
    console.log("🔐 Middleware - Token:", req.nextauth.token ? "✅ Presente" : "❌ Ausente");
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => {
        console.log("🔐 Authorized callback - Token:", token ? "✅ Presente" : "❌ Ausente");
        return !!token;
      },
    },
  }
);

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
  ],
};
