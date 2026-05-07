"use client";

import { useState } from "react";
import { Plus, Search, FileText, Download, Send, Copy, Eye, Edit, Trash2, Filter, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllProposals } from "@/lib/store";
import type { Proposal, ProposalStatus } from "@/types/proposal";

const statusColors: Record<ProposalStatus, string> = {
  RASCUNHO: "bg-gray-100 text-gray-800",
  GERADA: "bg-blue-100 text-blue-800",
  ENVIADA: "bg-yellow-100 text-yellow-800",
  ACEITA: "bg-green-100 text-green-800",
  REJEITADA: "bg-red-100 text-red-800",
  EXPIRADA: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<ProposalStatus, string> = {
  RASCUNHO: "Rascunho",
  GERADA: "Gerada",
  ENVIADA: "Enviada",
  ACEITA: "Aceita",
  REJEITADA: "Rejeitada",
  EXPIRADA: "Expirada",
};

export default function ProposalsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | "ALL">("ALL");
  // Lê do store em memória a cada render para pegar novas propostas criadas
  const proposals = getAllProposals();

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDownloadPDF = (proposalId: string) => {
    // TODO: Implementar download do PDF
    alert(`Download do PDF da proposta ${proposalId}`);
  };

  const handleSendProposal = (proposalId: string) => {
    // TODO: Implementar envio da proposta
    alert(`Enviar proposta ${proposalId}`);
  };

  const handleDuplicate = (proposalId: string) => {
    // TODO: Implementar duplicação da proposta
    alert(`Duplicar proposta ${proposalId}`);
  };

  const handleDelete = (proposalId: string) => {
    if (confirm("Tem certeza que deseja excluir esta proposta?")) {
      // TODO: Implementar exclusão
      alert(`Excluir proposta ${proposalId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/board"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Propostas</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gerencie suas propostas comerciais
                </p>
              </div>
            </div>
            <Link
              href="/proposals/new"
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Proposta</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | "ALL")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">Todos os status</option>
                <option value="RASCUNHO">Rascunho</option>
                <option value="GERADA">Gerada</option>
                <option value="ENVIADA">Enviada</option>
                <option value="ACEITA">Aceita</option>
                <option value="REJEITADA">Rejeitada</option>
                <option value="EXPIRADA">Expirada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{proposals.length}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Enviadas</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {proposals.filter((p) => p.status === "ENVIADA").length}
                </p>
              </div>
              <Send className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aceitas</p>
                <p className="text-2xl font-bold text-green-600">
                  {proposals.filter((p) => p.status === "ACEITA").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(
                    proposals
                      .filter((p) => p.status === "ACEITA")
                      .reduce((acc, p) => acc + p.financial.totalCost, 0)
                  )}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Potência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProposals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nenhuma proposta encontrada</p>
                      <Link
                        href="/proposals/new"
                        className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Criar primeira proposta</span>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          #{proposal.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {proposal.client.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {proposal.client.city}, {proposal.client.state}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(proposal.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proposal.system.totalPower} kWp
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(proposal.financial.totalCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[proposal.status]
                          }`}
                        >
                          {statusLabels[proposal.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => router.push(`/proposals/${proposal.id}`)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(proposal.id)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Baixar PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {proposal.status !== "ENVIADA" && proposal.status !== "ACEITA" && (
                            <button
                              onClick={() => handleSendProposal(proposal.id)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Enviar"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicate(proposal.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Duplicar"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {proposal.status === "RASCUNHO" && (
                            <>
                              <button
                                onClick={() => router.push(`/proposals/${proposal.id}/edit`)}
                                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(proposal.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
