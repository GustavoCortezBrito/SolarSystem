"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const userId = localStorage.getItem("userId");
    const companyId = localStorage.getItem("companyId");

    if (!userId) {
      router.push("/login");
      return;
    }

    if (!companyId) {
      router.push("/select-company");
      return;
    }
  }, [router]);

  return <>{children}</>;
}
