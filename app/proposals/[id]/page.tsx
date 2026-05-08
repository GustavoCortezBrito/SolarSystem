"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Download, Mail, MessageCircle, Copy, Edit, Check, ThumbsUp, ThumbsDown, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProposalById, updateProposal } from "@/lib/api";
import { generateProposalPDF } from "@/lib/pdfGenerator";
import type { Proposal } from "@/types/proposal";

const statusColors: Record<string, string> = {
  RASCUNHO: "bg-gray-100 text-gray-800",
  GERADA: "bg-blue-100 text-blue-800",
  ENVIADA: "bg-yellow-100 text-yellow-800",
  ACEITA: "bg-green-100 text-green-800",
  REJEITADA: "bg-red-100 text-red-800",
  EXPIRADA: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  RASCUNHO: "Rascunho", GERADA: "Gerada", ENVIADA: "Enviada",
  ACEITA: "Aceita", REJEITADA: "Rejeitada", EXPIRADA: "Expirada",
};

export default function ProposalPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"resumo" | "sistema" | "financeiro" | "termos">("resumo");

  useEffect(() => {
    async function fetchProposal() {
      try {
        const data = await getProposalById(proposalId);
        setProposal(data);
      } catch (error) {
        console.error("Erro ao buscar proposta:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [proposalId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Proposta não encontrada</h1>
          <Link href="/proposals" className="text-primary-600 hover:text-primary-800">Voltar para propostas</Link>
        </div>
      </div>
    );
  }

  const company = proposal.company;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const handleDownloadPDF = () => {
    if (!company) {
      alert("Dados da empresa não disponíveis");
      return;
    }
    
    // Criar objeto company compatível com o gerador de PDF
    const companyData = {
      id: company.id,
      name: company.name,
      cnpj: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      website: "",
      logo: "",
      proposalFooter: "Energia limpa e renovável para o seu futuro",
    };
    
    generateProposalPDF(proposal, companyData as any);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/proposals/${proposal.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = `Olá ${proposal.client.name}! Segue sua proposta de energia solar: ${window.location.origin}/proposals/${proposal.id}`;
    window.open(`https://wa.me/${proposal.client.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleChangeStatus = async (newStatus: "ACEITA" | "REJEITADA" | "ENVIADA") => {
    try {
      await updateProposal(proposal.id, { status: newStatus });
      router.push("/proposals");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status da proposta");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/proposals" className="text-gray-600 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">Proposta #{proposal.id.slice(-8)}</h1>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[proposal.status]}`}>
                  {statusLabels[proposal.status]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {proposal.client.name} • Criada em {fmtDate(proposal.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {proposal.status === "RASCUNHO" && (
              <Link href={`/proposals/${proposal.id}/edit`}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4" /><span>Editar</span>
              </Link>
            )}
            <button onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Download className="w-4 h-4" /><span>Baixar PDF</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Main ─────────────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Capa */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-10 text-white shadow-xl text-center space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">PROPOSTA COMERCIAL</h2>
                  <p className="text-primary-100 mt-1">Sistema de Energia Solar Fotovoltaica</p>
                </div>
                <div className="border-t border-primary-400 pt-4">
                  <p className="text-xl font-semibold">{proposal.client.name}</p>
                  {proposal.client.address && <p className="text-primary-100 text-sm">{proposal.client.address}</p>}
                  <p className="text-primary-100 text-sm">{proposal.client.city}, {proposal.client.state}</p>
                </div>
                <div className="border-t border-primary-400 pt-4">
                  <p className="text-sm text-primary-100">Válida até {fmtDate(proposal.validUntil)}</p>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Potência Total", value: `${proposal.system.totalPower} kWp`, color: "text-primary-600" },
                  { label: "Geração Mensal", value: `${proposal.system.monthlyGeneration} kWh`, color: "text-green-600" },
                  { label: "Investimento", value: fmt(proposal.financial.totalCost), color: "text-gray-900" },
                ].map((m) => (
                  <div key={m.label} className="bg-white rounded-lg p-5 border border-gray-200 text-center">
                    <p className="text-sm text-gray-500 mb-1">{m.label}</p>
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Abas */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  {(["resumo", "sistema", "financeiro", "termos"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50" : "text-gray-500 hover:bg-gray-50"}`}>
                      {tab === "resumo" ? "Resumo" : tab === "sistema" ? "Sistema" : tab === "financeiro" ? "Financeiro" : "Termos"}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === "resumo" && (
                    <div className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        Proposta para instalação de sistema fotovoltaico de <strong>{proposal.system.totalPower} kWp</strong>,
                        gerando <strong>{proposal.system.monthlyGeneration} kWh/mês</strong> com economia anual de{" "}
                        <strong>{fmt(proposal.financial.annualSavings)}</strong>.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Tipo", value: proposal.client.type },
                          { label: "Geração Anual", value: `${proposal.system.annualGeneration.toLocaleString()} kWh` },
                          { label: "Payback", value: `${proposal.financial.paybackYears.toFixed(1)} anos` },
                          { label: "ROI 25 anos", value: `${proposal.financial.roi.toFixed(0)}%` },
                        ].map((i) => (
                          <div key={i.label} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">{i.label}</p>
                            <p className="font-semibold text-gray-900">{i.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "sistema" && (
                    <div className="space-y-4">
                      {[
                        { label: "Módulos Fotovoltaicos", badge: `${proposal.system.modules.quantity}x`, color: "bg-primary-100 text-primary-800",
                          name: `${proposal.system.modules.manufacturer} ${proposal.system.modules.model}`,
                          details: [{ k: "Potência Unitária", v: `${proposal.system.modules.power}W` }, { k: "Potência Total", v: `${(proposal.system.modules.power * proposal.system.modules.quantity / 1000).toFixed(2)} kWp` }] },
                        { label: "Inversor", badge: `${proposal.system.inverter.quantity}x`, color: "bg-blue-100 text-blue-800",
                          name: `${proposal.system.inverter.manufacturer} ${proposal.system.inverter.model}`,
                          details: [{ k: "Potência Nominal", v: `${proposal.system.inverter.power}W` }] },
                        ...(proposal.system.batteries ? [{ label: "Bateria", badge: `${proposal.system.batteries.quantity}x`, color: "bg-green-100 text-green-800",
                          name: `${proposal.system.batteries.manufacturer} ${proposal.system.batteries.model}`,
                          details: [{ k: "Capacidade", v: `${proposal.system.batteries.capacity} kWh` }] }] : []),
                      ].map((eq) => (
                        <div key={eq.label} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs text-gray-500">{eq.label}</p>
                              <p className="font-semibold text-gray-900">{eq.name}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${eq.color}`}>{eq.badge}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {eq.details.map((d) => (
                              <div key={d.k}><p className="text-gray-500">{d.k}</p><p className="font-medium">{d.v}</p></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "financeiro" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Investimento</h3>
                        <div className="space-y-2">
                          {[
                            { label: "Equipamentos", value: proposal.financial.equipmentCost },
                            { label: "Instalação", value: proposal.financial.installationCost },
                            { label: "Projeto e Homologação", value: proposal.financial.projectCost },
                          ].map((i) => (
                            <div key={i.label} className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">{i.label}</span>
                              <span className="font-medium">{fmt(i.value)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between py-3 bg-primary-50 px-3 rounded-lg">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-primary-600 text-lg">{fmt(proposal.financial.totalCost)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Formas de Pagamento</h3>
                        <div className="space-y-2">
                          {proposal.financial.paymentOptions.map((opt, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900">{opt.name}</p>
                                {opt.discount && <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">{opt.discount}% desconto</span>}
                                {opt.installments > 1 && <p className="text-sm text-gray-500">{opt.installments}x de {fmt(opt.installmentValue)}</p>}
                              </div>
                              <p className="text-lg font-bold text-primary-600">{fmt(opt.totalValue)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Economia Mensal", value: fmt(proposal.financial.monthlySavings), bg: "bg-green-50", color: "text-green-700" },
                          { label: "Economia Anual", value: fmt(proposal.financial.annualSavings), bg: "bg-green-50", color: "text-green-700" },
                          { label: "Payback", value: `${proposal.financial.paybackYears.toFixed(1)} anos`, bg: "bg-blue-50", color: "text-blue-700" },
                          { label: "Economia 25 anos", value: fmt(proposal.financial.savings25Years), bg: "bg-purple-50", color: "text-purple-700" },
                        ].map((m) => (
                          <div key={m.label} className={`${m.bg} rounded-lg p-4`}>
                            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                            <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "termos" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Garantias</h3>
                        <ul className="space-y-2 text-gray-600">
                          {["25 anos de desempenho dos módulos fotovoltaicos", "10 anos do fabricante para os módulos", "5 anos para o inversor", "1 ano para instalação e mão de obra"].map((g) => (
                            <li key={g} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />{g}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Condições Gerais</h3>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {["Proposta válida por 7 dias", "Valores sujeitos a alteração após vistoria técnica", "Prazo de instalação: 30 a 45 dias após aprovação", "Homologação junto à concessionária inclusa"].map((c) => (
                            <li key={c}>• {c}</li>
                          ))}
                        </ul>
                      </div>
                      {proposal.notes && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
                          <p className="text-sm text-gray-600">{proposal.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Ações */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Ações</h3>
                <div className="space-y-2">
                  <button onClick={handleDownloadPDF}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Download className="w-4 h-4" />Baixar PDF
                  </button>
                  <button onClick={() => alert("Email será implementado")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Mail className="w-4 h-4" />Enviar por Email
                  </button>
                  <button onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />Enviar por WhatsApp
                  </button>
                  <button onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    {copied ? <><Check className="w-4 h-4 text-green-600" /><span className="text-green-600">Copiado!</span></> : <><Copy className="w-4 h-4" />Copiar Link</>}
                  </button>
                </div>
              </div>

              {/* Mudar Status */}
              {(proposal.status === "GERADA" || proposal.status === "ENVIADA") && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Atualizar Status</h3>
                  <div className="space-y-2">
                    {proposal.status === "GERADA" && (
                      <button onClick={() => handleChangeStatus("ENVIADA")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                        <Send className="w-4 h-4" />Marcar como Enviada
                      </button>
                    )}
                    <button onClick={() => handleChangeStatus("ACEITA")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <ThumbsUp className="w-4 h-4" />Proposta Aceita
                    </button>
                    <button onClick={() => handleChangeStatus("REJEITADA")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <ThumbsDown className="w-4 h-4" />Proposta Rejeitada
                    </button>
                  </div>
                </div>
              )}

              {/* Cliente */}
              {proposal.clientId && !proposal.clientId.startsWith("new-") && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Cliente</h3>
                  <Link href={`/clients/${proposal.clientId}`}
                    className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                      {proposal.client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{proposal.client.name}</p>
                      <p className="text-xs text-gray-500">{proposal.client.phone}</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Empresa */}
              {company && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Empresa</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">{company.name}</p>
                    {company.cnpj && <p>CNPJ: {company.cnpj}</p>}
                    {company.address && <p>{company.address}, {company.city}/{company.state}</p>}
                    {company.phone && <p>{company.phone}</p>}
                    {company.email && <p>{company.email}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
