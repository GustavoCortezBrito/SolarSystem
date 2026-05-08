"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function CompanySettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const storedCompanyId = localStorage.getItem("companyId");
    const storedCompanyName = localStorage.getItem("companyName");
    
    if (!storedCompanyId) {
      router.push("/select-company");
      return;
    }

    setCompanyId(storedCompanyId);
    setCompanyName(storedCompanyName || "Empresa");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!session?.user || !companyId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/board" className="text-gray-600 hover:text-primary-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configurações da Empresa</h1>
                <p className="text-sm text-gray-500">{companyName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Configurações da Empresa
          </h2>
          <p className="text-gray-600 mb-6">
            Esta página está em desenvolvimento. Em breve você poderá gerenciar:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              Informações da empresa (nome, CNPJ, endereço)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              Logo e identidade visual
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              Configurações de notificações
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              Integrações com outros sistemas
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
