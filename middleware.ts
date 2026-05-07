import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

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
