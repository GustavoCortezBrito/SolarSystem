// ============================================
// DADOS MOCKADOS - PROPOSTAS
// ============================================
// Usamos um array mutável para simular um banco de dados em memória.
// Em produção isso seria substituído por chamadas de API.

import type { Proposal, ProposalStatus } from "@/types/proposal";

// Array mutável — permite adicionar novas propostas em runtime
export const _proposals: Proposal[] = [
  {
    id: "prop-1",
    clientId: "client-1",
    companyId: "company-1",
    createdBy: "user-1",
    status: "ENVIADA",
    
    client: {
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 98765-4321",
      address: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      type: "RESIDENCIAL",
    },
    
    system: {
      totalPower: 5.4, // kWp
      monthlyGeneration: 675, // kWh/mês
      annualGeneration: 8100, // kWh/ano
      
      modules: {
        id: "mod-1",
        manufacturer: "Canadian Solar",
        model: "HiKu6 Mono PERC CS6R-410MS",
        power: 410,
        quantity: 13,
      },
      
      inverter: {
        id: "inv-1",
        manufacturer: "Growatt",
        model: "MIN 5000TL-XH",
        power: 5000,
        quantity: 1,
      },
    },
    
    financial: {
      equipmentCost: 18500,
      installationCost: 4500,
      projectCost: 2000,
      totalCost: 25000,
      pricePerWp: 4.63,
      
      currentMonthlyBill: 450,
      newMonthlyBill: 50, // Taxa mínima
      monthlySavings: 400,
      annualSavings: 4800,
      savings25Years: 120000,
      
      paybackMonths: 63,
      paybackYears: 5.25,
      roi: 380,
      
      paymentOptions: [
        {
          name: "À vista",
          installments: 1,
          installmentValue: 25000,
          totalValue: 25000,
          discount: 5,
        },
        {
          name: "Parcelado em 12x",
          installments: 12,
          installmentValue: 2291.67,
          totalValue: 27500,
        },
        {
          name: "Parcelado em 24x",
          installments: 24,
          installmentValue: 1250,
          totalValue: 30000,
        },
      ],
    },
    
    validUntil: "2026-05-14T23:59:59Z",
    notes: "Proposta válida por 7 dias. Valores sujeitos a alteração após vistoria técnica.",
    
    createdAt: "2026-05-07T10:00:00Z",
    updatedAt: "2026-05-07T10:00:00Z",
    sentAt: "2026-05-07T14:30:00Z",
    
    pdfUrl: "/proposals/prop-1.pdf",
    pdfGeneratedAt: "2026-05-07T14:30:00Z",
  },
  {
    id: "prop-2",
    clientId: "client-2",
    companyId: "company-1",
    createdBy: "user-2",
    status: "GERADA",
    
    client: {
      name: "Maria Santos",
      email: "maria.santos@empresa.com",
      phone: "(11) 91234-5678",
      address: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      type: "COMERCIAL",
    },
    
    system: {
      totalPower: 10.8,
      monthlyGeneration: 1350,
      annualGeneration: 16200,
      
      modules: {
        id: "mod-2",
        manufacturer: "Jinko Solar",
        model: "Tiger Neo N-type 78HL4-BDV 580W",
        power: 580,
        quantity: 18,
      },
      
      inverter: {
        id: "inv-2",
        manufacturer: "Fronius",
        model: "Primo GEN24 10.0 Plus",
        power: 10000,
        quantity: 1,
      },
      
      batteries: {
        id: "bat-1",
        manufacturer: "BYD",
        model: "Battery-Box Premium HVS 10.2",
        capacity: 10.2,
        quantity: 1,
      },
    },
    
    financial: {
      equipmentCost: 42000,
      installationCost: 8000,
      projectCost: 3500,
      totalCost: 53500,
      pricePerWp: 4.95,
      
      currentMonthlyBill: 900,
      newMonthlyBill: 100,
      monthlySavings: 800,
      annualSavings: 9600,
      savings25Years: 240000,
      
      paybackMonths: 67,
      paybackYears: 5.58,
      roi: 349,
      
      paymentOptions: [
        {
          name: "À vista",
          installments: 1,
          installmentValue: 53500,
          totalValue: 53500,
          discount: 5,
        },
        {
          name: "Parcelado em 12x",
          installments: 12,
          installmentValue: 4916.67,
          totalValue: 59000,
        },
      ],
    },
    
    validUntil: "2026-05-14T23:59:59Z",
    notes: "Sistema com bateria para backup de energia.",
    
    createdAt: "2026-05-06T15:00:00Z",
    updatedAt: "2026-05-06T15:00:00Z",
    
    pdfUrl: "/proposals/prop-2.pdf",
    pdfGeneratedAt: "2026-05-06T15:30:00Z",
  },
];

// ── Acesso público (somente leitura) ─────────────────────────────────────────
export function getAllProposals(): Proposal[] {
  return _proposals;
}

// Mantém compatibilidade com código existente que usa mockProposals diretamente
export const mockProposals = _proposals;

/**
 * Adiciona uma nova proposta ao store em memória.
 * Retorna a proposta criada com o ID gerado.
 */
export function addProposal(proposal: Proposal): Proposal {
  _proposals.unshift(proposal); // Mais recente primeiro
  return proposal;
}

/**
 * Helper para obter propostas de uma empresa
 */
export function getProposalsByCompany(companyId: string): Proposal[] {
  return _proposals.filter((p) => p.companyId === companyId);
}

/**
 * Helper para obter proposta por ID
 */
export function getProposalById(id: string): Proposal | undefined {
  return _proposals.find((p) => p.id === id);
}

/**
 * Helper para obter propostas de um cliente (suporta múltiplos projetos)
 */
export function getProposalsByClient(clientId: string): Proposal[] {
  return _proposals.filter((p) => p.clientId === clientId);
}

/**
 * Gera um ID único para nova proposta
 */
export function generateProposalId(): string {
  return `prop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
