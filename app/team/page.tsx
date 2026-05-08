"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Shield,
  Trash2,
  Edit2,
  Crown,
  Briefcase,
  Users as UsersIcon,
  ArrowLeft,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { getRoleLabel, getRoleColor, canRemoveMember, canChangeRole } from "@/lib/permissions";
import { Role, SubscriptionPlan, SubscriptionStatus, MembershipStatus, type AuthContext } from "@/types/auth";
import { useSession } from "next-auth/react";

interface Member {
  id: string;
  userId: string;
  companyId: string;
  role: Role;
  status: MembershipStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function TeamPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string>("");

  // Simular contexto do usuário logado
  const context: AuthContext = {
    user: { id: session?.user?.id || "", name: session?.user?.name || "", email: session?.user?.email || "", createdAt: "", updatedAt: "" },
    company: { id: companyId, name: "Solar Tech Ltda", slug: "solar-tech", plan: SubscriptionPlan.PROFESSIONAL, subscriptionStatus: SubscriptionStatus.ACTIVE, maxUsers: 15, maxBoards: 10, settings: { timezone: "", currency: "", language: "", features: { dimensionamento: true, propostas: true, automacoes: true, integracao_whatsapp: true } }, createdAt: "", updatedAt: "" },
    membership: { id: "membership-1", userId: session?.user?.id || "", companyId: companyId, role: Role.OWNER, status: MembershipStatus.ACTIVE, createdAt: "", updatedAt: "" },
    permissions: [],
  };

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      fetchMembers(storedCompanyId);
    } else {
      setIsLoading(false);
      setError("Empresa não encontrada");
    }
  }, []);

  async function fetchMembers(companyId: string) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/companies/${companyId}/members`);
      if (!response.ok) throw new Error("Erro ao buscar membros");
      const data = await response.json();
      // A API retorna { members: [...] }
      setMembers(data.members || []);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
      setError("Erro ao carregar membros da equipe");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.OWNER:
        return <Crown className="w-4 h-4" />;
      case Role.ADMIN:
        return <Shield className="w-4 h-4" />;
      case Role.MANAGER:
        return <Briefcase className="w-4 h-4" />;
      default:
        return <UsersIcon className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando equipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => companyId && fetchMembers(companyId)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
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
                <h1 className="text-2xl font-bold text-gray-900">Equipe</h1>
                <p className="text-sm text-gray-500">
                  {members.length} membros • {context.company.maxUsers - members.length} vagas disponíveis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {context.membership.role === Role.OWNER && (
                <Link
                  href="/team/roles"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Cargos Customizados</span>
                </Link>
              )}
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Convidar Membro</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adicionado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.user.name}
                            {member.userId === context.user.id && (
                              <span className="ml-2 text-xs text-gray-500">(Você)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{member.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        <span>{getRoleLabel(member.role)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {selectedMember === member.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                          >
                            {canChangeRole(context, member.role) && (
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                                <Edit2 className="w-4 h-4" />
                                <span>Alterar cargo</span>
                              </button>
                            )}
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>Enviar email</span>
                            </button>
                            {canRemoveMember(context, member) && (
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                                <Trash2 className="w-4 h-4" />
                                <span>Remover</span>
                              </button>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Convidar Membro</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="SELLER">Vendedor</option>
                  <option value="MANAGER">Gerente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Enviar Convite
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
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
