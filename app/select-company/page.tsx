"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Users, Crown, Shield, Briefcase, ChevronRight, LogOut } from "lucide-react";
import { getRoleLabel, getRoleColor } from "@/lib/permissions";
import { Role } from "@/types/auth";

interface Company {
  id: string;
  name: string;
  plan: string;
}

interface Membership {
  role: string;
}

export default function SelectCompanyPage() {
  const router = useRouter();
  const [userCompanies, setUserCompanies] = useState<
    Array<{ company: Company; membership: Membership }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");

  useEffect(() => {
    const fetchUserCompanies = async () => {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/companies", {
          headers: {
            "x-user-id": userId,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar empresas");
        }

        const data = await response.json();
        
        // Transformar dados para o formato esperado
        const companiesWithMembership = data.companies.map((company: any) => ({
          company: {
            id: company.id,
            name: company.name,
            plan: "FREE", // Temporário - adicionar plano no banco depois
          },
          membership: {
            role: company.role,
          },
        }));

        setUserCompanies(companiesWithMembership);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        setUserCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCompanies();
  }, [router]);

  const handleSelectCompany = (companyId: string) => {
    localStorage.setItem("companyId", companyId);
    router.push("/board");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="w-5 h-5" />;
      case "ADMIN":
        return <Shield className="w-5 h-5" />;
      case "MANAGER":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      FREE: { label: "Grátis", color: "bg-gray-100 text-gray-800" },
      STARTER: { label: "Starter", color: "bg-blue-100 text-blue-800" },
      PROFESSIONAL: { label: "Professional", color: "bg-purple-100 text-purple-800" },
      ENTERPRISE: { label: "Enterprise", color: "bg-green-100 text-green-800" },
    };
    return badges[plan] || badges.FREE;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">SS</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Selecione uma empresa
          </h1>
          <p className="text-lg text-gray-600">
            Você tem acesso a {userCompanies.length}{" "}
            {userCompanies.length === 1 ? "empresa" : "empresas"}
          </p>
        </motion.div>

        {/* Lista de Empresas */}
        <div className="space-y-4">
          {userCompanies.map(({ company, membership }, index) => {
            const planBadge = getPlanBadge(company.plan);
            
            return (
              <motion.button
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectCompany(company.id)}
                className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-primary-500 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Logo da Empresa */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-primary-600" />
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {company.name}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${planBadge.color}`}
                        >
                          {planBadge.label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {/* Role */}
                        <div className="flex items-center space-x-2">
                          <span className={`${getRoleColor(membership.role as Role)} px-2 py-1 rounded flex items-center space-x-1`}>
                            {getRoleIcon(membership.role)}
                            <span className="font-medium">
                              {getRoleLabel(membership.role as Role)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seta */}
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Criar Nova Empresa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-2 mx-auto"
          >
            <Building2 className="w-5 h-5" />
            <span>Criar nova empresa</span>
          </button>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-2 mx-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da conta</span>
          </button>
        </motion.div>
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Criar Nova Empresa</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCompanyName.trim()) return;

                const userId = localStorage.getItem("userId");
                if (!userId) {
                  alert("Erro: Usuário não autenticado");
                  return;
                }

                try {
                  const response = await fetch("/api/companies", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "x-user-id": userId,
                    },
                    body: JSON.stringify({
                      name: newCompanyName.trim(),
                    }),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    alert(data.error || "Erro ao criar empresa");
                    return;
                  }

                  // Sucesso - recarregar a página para mostrar a nova empresa
                  alert("Empresa criada com sucesso!");
                  setShowCreateModal(false);
                  setNewCompanyName("");
                  window.location.reload();
                } catch (error) {
                  console.error("Erro ao criar empresa:", error);
                  alert("Erro ao criar empresa. Tente novamente.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Minha Nova Empresa"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Plano FREE</strong> será ativado automaticamente:
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• 2 usuários</li>
                  <li>• 1 board</li>
                  <li>• 50 leads/mês</li>
                </ul>
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Criar Empresa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewCompanyName("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
