"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import {
  ArrowLeft, ArrowRight, Check, User, Zap, Package, DollarSign,
  Search, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllModules } from "@/lib/mockModuleData";
import { getAllInverters } from "@/lib/mockInverterData";
import { LocationSelector } from "@/components/LocationSelector";
import { getClients, createProposal } from "@/lib/api";
import type { Proposal } from "@/types/proposal";
import type { Client } from "@/types/client";

const ALL_MODULES = getAllModules();
const ALL_INVERTERS = getAllInverters();

// ─── Constantes de cálculo ───────────────────────────────────────────────────
const HORAS_SOL_PICO = 4.5;          // HSP média Brasil
const FATOR_EFICIENCIA = 0.80;       // Perdas do sistema
const MARGEM_SEGURANCA = 1.20;       // 20% de margem
const TARIFA_ENERGIA = 0.85;         // R$/kWh (média Brasil)
const TAXA_MINIMA_MENSAL = 50;       // R$ taxa mínima concessionária
const ANOS_VIDA_UTIL = 25;

function calcularSistema(consumoMensal: number, potenciaModulo: number) {
  const potenciaNecessaria =
    (consumoMensal * MARGEM_SEGURANCA) / (30 * HORAS_SOL_PICO * FATOR_EFICIENCIA);
  const qtdModulos = Math.ceil((potenciaNecessaria * 1000) / potenciaModulo);
  const potenciaReal = (qtdModulos * potenciaModulo) / 1000;
  const geracaoMensal = Math.round(potenciaReal * 30 * HORAS_SOL_PICO * FATOR_EFICIENCIA);
  const geracaoAnual = geracaoMensal * 12;
  return { potenciaReal, qtdModulos, geracaoMensal, geracaoAnual };
}

function calcularFinanceiro(
  totalCost: number,
  contaMensal: number,
  geracaoMensal: number,
  potenciaReal: number
) {
  const economiaMensal = Math.min(contaMensal - TAXA_MINIMA_MENSAL, geracaoMensal * TARIFA_ENERGIA);
  const economiaAnual = economiaMensal * 12;
  const economia25Anos = economiaAnual * ANOS_VIDA_UTIL;
  const paybackMeses = totalCost / economiaMensal;
  const paybackAnos = paybackMeses / 12;
  const roi = ((economia25Anos - totalCost) / totalCost) * 100;
  const precoWp = totalCost / (potenciaReal * 1000);
  return { economiaMensal, economiaAnual, economia25Anos, paybackMeses, paybackAnos, roi, precoWp };
}

// ─── Tipos internos do wizard ─────────────────────────────────────────────────
interface WizardData {
  // Passo 1 – Cliente
  clienteExistenteId: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  clienteTipo: "RESIDENCIAL" | "COMERCIAL" | "INDUSTRIAL" | "RURAL";
  clienteEndereco: string;
  clienteEstadoId: string;
  clienteEstadoSigla: string;
  clienteCidade: string;

  // Passo 2 – Consumo
  consumoMensal: number;
  contaMensal: number;

  // Passo 3 – Equipamentos
  moduloId: string;
  inversorId: string;
  bateriaId: string;
  otimizadorId: string;

  // Passo 4 – Valores
  custoEquipamentos: number;
  custoInstalacao: number;
  custoProjeto: number;
  validadeDias: number;
  observacoes: string;
  descontoAVista: number;
  parcelamento12: boolean;
  parcelamento24: boolean;
  parcelamento48: boolean;
}

const INITIAL: WizardData = {
  clienteExistenteId: "",
  clienteNome: "",
  clienteEmail: "",
  clienteTelefone: "",
  clienteTipo: "RESIDENCIAL",
  clienteEndereco: "",
  clienteEstadoId: "",
  clienteEstadoSigla: "",
  clienteCidade: "",
  consumoMensal: 0,
  contaMensal: 0,
  moduloId: "",
  inversorId: "",
  bateriaId: "",
  otimizadorId: "",
  custoEquipamentos: 0,
  custoInstalacao: 0,
  custoProjeto: 0,
  validadeDias: 7,
  observacoes: "",
  descontoAVista: 5,
  parcelamento12: true,
  parcelamento24: true,
  parcelamento48: false,
};

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>}>
      <NewProposalWizard />
    </Suspense>
  );
}

function NewProposalWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL);
  const [clientSearch, setClientSearch] = useState("");
  const [moduloSearch, setModuloSearch] = useState("");
  const [inversorSearch, setInversorSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Carregar clientes da API
  useEffect(() => {
    async function init() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (!session?.user?.id) {
          alert("Usuário não autenticado");
          router.push("/login");
          return;
        }

        const storedCompanyId = localStorage.getItem("companyId");
        if (!storedCompanyId) {
          alert("Empresa não selecionada");
          router.push("/select-company");
          return;
        }

        setCompanyId(storedCompanyId);
        setUserId(session.user.id);

        // Buscar clientes da API
        const clientsData = await getClients(storedCompanyId);
        setClientes(clientsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados");
        setLoading(false);
      }
    }
    init();
  }, [router]);

  // Pré-selecionar cliente se vier via query param ?clientId=
  useEffect(() => {
    const clientId = searchParams.get("clientId");
    if (clientId) {
      handleClienteExistente(clientId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Módulos e inversores filtrados ──────────────────────────────────────────
  const modulosFiltrados = useMemo(
    () =>
      ALL_MODULES
        .filter(
          (m) =>
            m.manufacturer.toLowerCase().includes(moduloSearch.toLowerCase()) ||
            m.model.toLowerCase().includes(moduloSearch.toLowerCase())
        )
        .slice(0, 20),
    [moduloSearch]
  );

  const inversorFiltrados = useMemo(
    () =>
      ALL_INVERTERS
        .filter(
          (i) =>
            i.manufacturer.toLowerCase().includes(inversorSearch.toLowerCase()) ||
            i.model.toLowerCase().includes(inversorSearch.toLowerCase())
        )
        .slice(0, 20),
    [inversorSearch]
  );

  const clientesFiltrados = useMemo(
    () =>
      clientes.filter((c) =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase())
      ),
    [clientes, clientSearch]
  );

  // ── Módulo e inversor selecionados ──────────────────────────────────────────
  const moduloSelecionado = ALL_MODULES.find((m) => m.id === data.moduloId);
  const inversorSelecionado = ALL_INVERTERS.find((i) => i.id === data.inversorId);

  // ── Cálculos automáticos ────────────────────────────────────────────────────
  const calc = useMemo(() => {
    if (!data.consumoMensal || !moduloSelecionado) return null;
    return calcularSistema(data.consumoMensal, moduloSelecionado.power);
  }, [data.consumoMensal, moduloSelecionado]);

  const totalCusto = data.custoEquipamentos + data.custoInstalacao + data.custoProjeto;

  const financeiro = useMemo(() => {
    if (!calc || !totalCusto || !data.contaMensal) return null;
    return calcularFinanceiro(totalCusto, data.contaMensal, calc.geracaoMensal, calc.potenciaReal);
  }, [calc, totalCusto, data.contaMensal]);

  // ── Preencher custo de equipamentos automaticamente ─────────────────────────
  useEffect(() => {
    if (calc && moduloSelecionado) {
      // Estimativa: R$ 1,20/W para equipamentos
      const estimativa = Math.round(calc.potenciaReal * 1000 * 1.2);
      setData((d) => ({ ...d, custoEquipamentos: estimativa }));
    }
  }, [calc, moduloSelecionado]);

  // ── Preencher dados do cliente existente ────────────────────────────────────
  const handleClienteExistente = (clienteId: string) => {
    const c = clientes.find((cl) => cl.id === clienteId);
    if (!c) {
      setData((d) => ({ ...d, clienteExistenteId: "", clienteNome: "", clienteEmail: "", clienteTelefone: "" }));
      return;
    }
    setData((d) => ({
      ...d,
      clienteExistenteId: clienteId,
      clienteNome: c.name,
      clienteEmail: c.email,
      clienteTelefone: c.phone,
      clienteTipo: (c.type as any) === "RESIDENTIAL" ? "RESIDENCIAL"
        : (c.type as any) === "COMMERCIAL" ? "COMERCIAL"
        : (c.type as any) === "INDUSTRIAL" ? "INDUSTRIAL"
        : "RURAL",
      clienteEndereco: c.address ? `${c.address.street}, ${c.address.number}` : "",
      clienteCidade: c.address?.city ?? "",
      clienteEstadoSigla: c.address?.state ?? "",
      clienteEstadoId: "",
      consumoMensal: c.averageConsumption ?? 0,
    }));
  };

  // ── Validação por passo ─────────────────────────────────────────────────────
  const stepValid = useMemo(() => {
    if (step === 1) return !!data.clienteNome && !!data.clienteTelefone && !!data.clienteCidade && !!data.clienteEstadoSigla;
    if (step === 2) return data.consumoMensal > 0 && data.contaMensal > 0;
    if (step === 3) return !!data.moduloId && !!data.inversorId;
    if (step === 4) return totalCusto > 0;
    return false;
  }, [step, data, totalCusto]);

  const set = (field: keyof WizardData, value: any) =>
    setData((d) => ({ ...d, [field]: value }));

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!calc || !moduloSelecionado || !inversorSelecionado || !financeiro) return;
    setSubmitting(true);

    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + data.validadeDias);

      const paymentOptions = [];
      // À vista sempre incluso
      paymentOptions.push({
        name: "À vista",
        installments: 1,
        installmentValue: totalCusto * (1 - data.descontoAVista / 100),
        totalValue: totalCusto * (1 - data.descontoAVista / 100),
        discount: data.descontoAVista,
      });
      if (data.parcelamento12) {
        paymentOptions.push({
          name: "Parcelado em 12x",
          installments: 12,
          installmentValue: totalCusto / 12,
          totalValue: totalCusto,
        });
      }
      if (data.parcelamento24) {
        paymentOptions.push({
          name: "Parcelado em 24x",
          installments: 24,
          installmentValue: totalCusto / 24,
          totalValue: totalCusto,
        });
      }
      if (data.parcelamento48) {
        paymentOptions.push({
          name: "Parcelado em 48x",
          installments: 48,
          installmentValue: totalCusto / 48,
          totalValue: totalCusto,
        });
      }

      const newProposal = {
        clientId: data.clienteExistenteId || undefined,
        companyId: companyId,
        createdBy: userId,
        status: "GERADA" as const,

        client: {
          name: data.clienteNome,
          email: data.clienteEmail || undefined,
          phone: data.clienteTelefone,
          address: data.clienteEndereco || undefined,
          city: data.clienteCidade,
          state: data.clienteEstadoSigla,
          type: data.clienteTipo,
        },

        system: {
          totalPower: calc.potenciaReal,
          monthlyGeneration: calc.geracaoMensal,
          annualGeneration: calc.geracaoAnual,
          modules: {
            id: moduloSelecionado.id,
            manufacturer: moduloSelecionado.manufacturer,
            model: moduloSelecionado.model,
            power: moduloSelecionado.power,
            quantity: calc.qtdModulos,
          },
          inverter: {
            id: inversorSelecionado.id,
            manufacturer: inversorSelecionado.manufacturer,
            model: inversorSelecionado.model,
            power: inversorSelecionado.nominalPower,
            quantity: 1,
          },
        },

        financial: {
          equipmentCost: data.custoEquipamentos,
          installationCost: data.custoInstalacao,
          projectCost: data.custoProjeto,
          totalCost: totalCusto,
          pricePerWp: financeiro.precoWp,
          currentMonthlyBill: data.contaMensal,
          newMonthlyBill: TAXA_MINIMA_MENSAL,
          monthlySavings: financeiro.economiaMensal,
          annualSavings: financeiro.economiaAnual,
          savings25Years: financeiro.economia25Anos,
          paybackMonths: financeiro.paybackMeses,
          paybackYears: financeiro.paybackAnos,
          roi: financeiro.roi,
          paymentOptions,
        },

        validUntil: validUntil.toISOString(),
        notes: data.observacoes || undefined,
      };

      const created = await createProposal(newProposal);
      router.push(`/proposals/${created.id}`);
    } catch (error) {
      console.error("Erro ao criar proposta:", error);
      alert("Erro ao criar proposta. Tente novamente.");
      setSubmitting(false);
    }
  };

  const steps = [
    { n: 1, label: "Cliente", icon: User },
    { n: 2, label: "Consumo", icon: Zap },
    { n: 3, label: "Equipamentos", icon: Package },
    { n: 4, label: "Valores", icon: DollarSign },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/proposals" className="text-gray-600 hover:text-primary-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Nova Proposta</h1>
              <p className="text-xs text-gray-500">Passo {step} de 4</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-5 max-w-4xl mx-auto">
          <div className="flex items-center">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const done = step > s.n;
              const active = step === s.n;
              return (
                <div key={s.n} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-primary-600 border-primary-600" : active ? "bg-white border-primary-600" : "bg-white border-gray-300"}`}>
                      {done ? <Check className="w-5 h-5 text-white" /> : <Icon className={`w-5 h-5 ${active ? "text-primary-600" : "text-gray-400"}`} />}
                    </div>
                    <span className={`mt-1 text-xs font-medium ${active || done ? "text-primary-600" : "text-gray-400"}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 ${done ? "bg-primary-600" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

            {/* ═══════════════════════════════════════════════════════════════
                PASSO 1 – CLIENTE
            ═══════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Dados do Cliente</h2>
                  <p className="text-sm text-gray-500 mt-1">Selecione um cliente cadastrado ou preencha manualmente</p>
                </div>

                {/* Busca de cliente existente */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Vincular a cliente cadastrado
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar cliente por nome..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <select
                    value={data.clienteExistenteId}
                    onChange={(e) => handleClienteExistente(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">— Novo cliente / preencher manualmente —</option>
                    {clientesFiltrados.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} • {c.phone} • {c.address?.city ?? ""}
                      </option>
                    ))}
                  </select>
                  {data.clienteExistenteId && (
                    <p className="text-xs text-blue-700 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Dados preenchidos automaticamente. Você pode editar abaixo.
                    </p>
                  )}
                </div>

                {/* Campos do cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo <span className="text-red-500">*</span></label>
                    <input type="text" value={data.clienteNome} onChange={(e) => set("clienteNome", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="João Silva" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone <span className="text-red-500">*</span></label>
                    <input type="tel" value={data.clienteTelefone} onChange={(e) => set("clienteTelefone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="(11) 98765-4321" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={data.clienteEmail} onChange={(e) => set("clienteEmail", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="joao@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Instalação <span className="text-red-500">*</span></label>
                    <select value={data.clienteTipo} onChange={(e) => set("clienteTipo", e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="RESIDENCIAL">Residencial</option>
                      <option value="COMERCIAL">Comercial</option>
                      <option value="INDUSTRIAL">Industrial</option>
                      <option value="RURAL">Rural</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input type="text" value={data.clienteEndereco} onChange={(e) => set("clienteEndereco", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Rua das Flores, 123" />
                  </div>
                  <div className="md:col-span-2">
                    <LocationSelector
                      stateValue={data.clienteEstadoId}
                      cityValue={data.clienteCidade}
                      required
                      onStateChange={(id, sigla) => setData((d) => ({ ...d, clienteEstadoId: id, clienteEstadoSigla: sigla }))}
                      onCityChange={(city) => set("clienteCidade", city)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                PASSO 2 – CONSUMO
            ═══════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Dados de Consumo</h2>
                  <p className="text-sm text-gray-500 mt-1">Informe o consumo e valor da conta de energia elétrica</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consumo Mensal (kWh) <span className="text-red-500">*</span></label>
                    <input type="number" min={0} value={data.consumoMensal || ""}
                      onChange={(e) => set("consumoMensal", Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="500" />
                    <p className="text-xs text-gray-500 mt-1">Média dos últimos 3 meses da conta de energia</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Conta (R$/mês) <span className="text-red-500">*</span></label>
                    <input type="number" min={0} value={data.contaMensal || ""}
                      onChange={(e) => set("contaMensal", Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="450" />
                    <p className="text-xs text-gray-500 mt-1">Valor médio mensal pago à concessionária</p>
                  </div>
                </div>

                {/* Preview de estimativa */}
                {data.consumoMensal > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-primary-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Estimativa Preliminar
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-blue-600 mb-1">Potência Necessária</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {((data.consumoMensal * MARGEM_SEGURANCA) / (30 * HORAS_SOL_PICO * FATOR_EFICIENCIA)).toFixed(2)} kWp
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-blue-600 mb-1">Geração Estimada</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {Math.round(((data.consumoMensal * MARGEM_SEGURANCA) / (30 * HORAS_SOL_PICO * FATOR_EFICIENCIA)) * 30 * HORAS_SOL_PICO * FATOR_EFICIENCIA)} kWh/mês
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-blue-600 mb-1">Economia Anual Est.</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {data.contaMensal > 0
                            ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                Math.min(data.contaMensal - 50, data.consumoMensal * TARIFA_ENERGIA) * 12
                              )
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-500 mt-3 text-center">
                      * Estimativa baseada em HSP média de {HORAS_SOL_PICO}h/dia e eficiência de {FATOR_EFICIENCIA * 100}%
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                PASSO 3 – EQUIPAMENTOS
            ═══════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Equipamentos</h2>
                  <p className="text-sm text-gray-500 mt-1">Selecione os equipamentos do sistema fotovoltaico</p>
                </div>

                {/* Módulos */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Módulo Fotovoltaico <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Buscar módulo por fabricante ou modelo..."
                      value={moduloSearch} onChange={(e) => setModuloSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    {modulosFiltrados.map((m) => (
                      <button key={m.id} type="button"
                        onClick={() => set("moduloId", m.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm border-b border-gray-100 last:border-0 transition-colors ${data.moduloId === m.id ? "bg-primary-50 border-l-4 border-l-primary-600" : "hover:bg-gray-50"}`}>
                        <div>
                          <span className="font-medium text-gray-900">{m.manufacturer} {m.model}</span>
                          <span className="text-gray-500 ml-2">• {m.power}W</span>
                        </div>
                        {data.moduloId === m.id && <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                      </button>
                    ))}
                    {modulosFiltrados.length === 0 && (
                      <p className="px-4 py-6 text-center text-sm text-gray-500">Nenhum módulo encontrado</p>
                    )}
                  </div>
                  {moduloSelecionado && calc && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                      <span className="font-medium text-green-800">Selecionado:</span>
                      <span className="text-green-700 ml-1">{moduloSelecionado.manufacturer} {moduloSelecionado.model} ({moduloSelecionado.power}W)</span>
                      <span className="text-green-600 ml-2">→ {calc.qtdModulos} unidades = {calc.potenciaReal.toFixed(2)} kWp</span>
                    </div>
                  )}
                </div>

                {/* Inversor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Inversor <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Buscar inversor por fabricante ou modelo..."
                      value={inversorSearch} onChange={(e) => setInversorSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    {inversorFiltrados.map((i) => (
                      <button key={i.id} type="button"
                        onClick={() => set("inversorId", i.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm border-b border-gray-100 last:border-0 transition-colors ${data.inversorId === i.id ? "bg-primary-50 border-l-4 border-l-primary-600" : "hover:bg-gray-50"}`}>
                        <div>
                          <span className="font-medium text-gray-900">{i.manufacturer} {i.model}</span>
                          <span className="text-gray-500 ml-2">• {(i.nominalPower / 1000).toFixed(1)} kW</span>
                        </div>
                        {data.inversorId === i.id && <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                      </button>
                    ))}
                    {inversorFiltrados.length === 0 && (
                      <p className="px-4 py-6 text-center text-sm text-gray-500">Nenhum inversor encontrado</p>
                    )}
                  </div>
                  {inversorSelecionado && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                      <span className="font-medium text-green-800">Selecionado:</span>
                      <span className="text-green-700 ml-1">{inversorSelecionado.manufacturer} {inversorSelecionado.model} ({(inversorSelecionado.nominalPower / 1000).toFixed(1)} kW)</span>
                    </div>
                  )}
                </div>

                {/* Resumo do sistema */}
                {calc && moduloSelecionado && inversorSelecionado && (
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-primary-900 mb-3">Resumo do Sistema</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-primary-600">Potência</p>
                        <p className="text-lg font-bold text-primary-900">{calc.potenciaReal.toFixed(2)} kWp</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-primary-600">Módulos</p>
                        <p className="text-lg font-bold text-primary-900">{calc.qtdModulos} un.</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-primary-600">Geração/mês</p>
                        <p className="text-lg font-bold text-primary-900">{calc.geracaoMensal} kWh</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-primary-600">Geração/ano</p>
                        <p className="text-lg font-bold text-primary-900">{calc.geracaoAnual.toLocaleString()} kWh</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* ═══════════════════════════════════════════════════════════════
                PASSO 4 – VALORES
            ═══════════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Valores e Condições</h2>
                  <p className="text-sm text-gray-500 mt-1">Defina os custos, formas de pagamento e validade da proposta</p>
                </div>

                {/* Custos */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Composição do Investimento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Equipamentos (R$) <span className="text-red-500">*</span></label>
                      <input type="number" min={0} value={data.custoEquipamentos || ""}
                        onChange={(e) => set("custoEquipamentos", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="18000" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Instalação / Mão de obra (R$)</label>
                      <input type="number" min={0} value={data.custoInstalacao || ""}
                        onChange={(e) => set("custoInstalacao", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="4500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Projeto e Homologação (R$)</label>
                      <input type="number" min={0} value={data.custoProjeto || ""}
                        onChange={(e) => set("custoProjeto", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="2000" />
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-3 flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg px-4 py-3">
                    <span className="text-sm font-semibold text-primary-900">Total do Investimento</span>
                    <span className="text-xl font-bold text-primary-700">{formatCurrency(totalCusto)}</span>
                  </div>
                </div>

                {/* Formas de pagamento */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Formas de Pagamento</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked id="avista" readOnly className="w-4 h-4 text-primary-600" />
                        <label htmlFor="avista" className="text-sm font-medium text-gray-700">À vista</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Desconto:</span>
                        <input type="number" min={0} max={30} value={data.descontoAVista}
                          onChange={(e) => set("descontoAVista", Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <span className="text-xs text-gray-500">%</span>
                        <span className="text-sm font-semibold text-green-700 ml-2">
                          {formatCurrency(totalCusto * (1 - data.descontoAVista / 100))}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="p12" checked={data.parcelamento12}
                          onChange={(e) => set("parcelamento12", e.target.checked)} className="w-4 h-4 text-primary-600" />
                        <label htmlFor="p12" className="text-sm font-medium text-gray-700">Parcelado em 12x</label>
                      </div>
                      {data.parcelamento12 && totalCusto > 0 && (
                        <span className="text-sm font-semibold text-gray-700">
                          12x de {formatCurrency(totalCusto / 12)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="p24" checked={data.parcelamento24}
                          onChange={(e) => set("parcelamento24", e.target.checked)} className="w-4 h-4 text-primary-600" />
                        <label htmlFor="p24" className="text-sm font-medium text-gray-700">Parcelado em 24x</label>
                      </div>
                      {data.parcelamento24 && totalCusto > 0 && (
                        <span className="text-sm font-semibold text-gray-700">
                          24x de {formatCurrency(totalCusto / 24)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="p48" checked={data.parcelamento48}
                          onChange={(e) => set("parcelamento48", e.target.checked)} className="w-4 h-4 text-primary-600" />
                        <label htmlFor="p48" className="text-sm font-medium text-gray-700">Parcelado em 48x</label>
                      </div>
                      {data.parcelamento48 && totalCusto > 0 && (
                        <span className="text-sm font-semibold text-gray-700">
                          48x de {formatCurrency(totalCusto / 48)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Análise financeira */}
                {financeiro && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-green-900 mb-3">Análise de Retorno</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-green-600">Economia Mensal</p>
                        <p className="text-lg font-bold text-green-800">{formatCurrency(financeiro.economiaMensal)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-green-600">Economia Anual</p>
                        <p className="text-lg font-bold text-green-800">{formatCurrency(financeiro.economiaAnual)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-green-600">Payback</p>
                        <p className="text-lg font-bold text-green-800">{financeiro.paybackAnos.toFixed(1)} anos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-green-600">ROI 25 anos</p>
                        <p className="text-lg font-bold text-green-800">{financeiro.roi.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validade e observações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validade da Proposta (dias)</label>
                    <input type="number" min={1} max={90} value={data.validadeDias}
                      onChange={(e) => set("validadeDias", Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço por Wp</label>
                    <input type="text" readOnly
                      value={financeiro ? `R$ ${financeiro.precoWp.toFixed(2)}/Wp` : "—"}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea rows={3} value={data.observacoes}
                      onChange={(e) => set("observacoes", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="Informações adicionais para o cliente..." />
                  </div>
                </div>
              </div>
            )}

            {/* ── Navegação ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {!stepValid && (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Preencha os campos obrigatórios
                  </span>
                )}
                {step < 4 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!stepValid}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!stepValid || submitting}
                    className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Gerando proposta...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Gerar Proposta
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
