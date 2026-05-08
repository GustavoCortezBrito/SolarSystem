"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Aguardar carregamento da sessão
    if (status === "loading") return;

    // Verificar autenticação
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Verificar se tem empresa selecionada
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/select-company");
      return;
    }
  }, [router, status]);

  // Mostrar loading enquanto verifica
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
