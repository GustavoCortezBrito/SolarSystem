// Tipos para o sistema de propostas

export type ProposalStatus = "RASCUNHO" | "GERADA" | "ENVIADA" | "ACEITA" | "REJEITADA" | "EXPIRADA";

export interface ProposalSystem {
  // Potência
  totalPower: number; // kWp
  
  // Geração
  monthlyGeneration: number; // kWh/mês
  annualGeneration: number; // kWh/ano
  
  // Equipamentos
  modules: {
    id: string;
    manufacturer: string;
    model: string;
    power: number; // W
    quantity: number;
  };
  
  inverter: {
    id: string;
    manufacturer: string;
    model: string;
    power: number; // W
    quantity: number;
  };
  
  batteries?: {
    id: string;
    manufacturer: string;
    model: string;
    capacity: number; // kWh
    quantity: number;
  };
  
  optimizers?: {
    id: string;
    manufacturer: string;
    model: string;
    quantity: number;
  };
  
  // Outros componentes
  otherComponents?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

export interface ProposalFinancial {
  // Investimento
  equipmentCost: number; // Custo dos equipamentos
  installationCost: number; // Mão de obra
  projectCost: number; // Projeto e homologação
  totalCost: number; // Total do investimento
  pricePerWp: number; // R$/Wp
  
  // Economia
  currentMonthlyBill: number; // Conta atual (R$/mês)
  newMonthlyBill: number; // Nova conta (R$/mês) - taxa mínima
  monthlySavings: number; // Economia mensal (R$)
  annualSavings: number; // Economia anual (R$)
  savings25Years: number; // Economia em 25 anos (R$)
  
  // Retorno
  paybackMonths: number; // Payback em meses
  paybackYears: number; // Payback em anos
  roi: number; // ROI em % (25 anos)
  
  // Formas de pagamento
  paymentOptions: {
    name: string; // Ex: "À vista", "Parcelado em 12x"
    installments: number;
    installmentValue: number;
    totalValue: number;
    discount?: number; // % de desconto
  }[];
}

export interface Proposal {
  id: string;
  clientId: string;
  companyId: string;
  createdBy: string; // userId
  
  // Status
  status: ProposalStatus;
  
  // Dados do cliente (snapshot)
  client: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    type: "RESIDENCIAL" | "COMERCIAL" | "INDUSTRIAL" | "RURAL";
  };
  
  // Sistema proposto
  system: ProposalSystem;
  
  // Financeiro
  financial: ProposalFinancial;
  
  // Configurações
  validUntil: string; // Data de validade
  notes?: string; // Observações
  
  // Metadados
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  
  // PDF
  pdfUrl?: string; // URL do PDF gerado
  pdfGeneratedAt?: string;
}

export interface ProposalInput {
  clientId: string;
  
  // Consumo
  monthlyConsumption: number; // kWh/mês
  monthlyBill: number; // R$/mês
  
  // Sistema
  selectedModuleId: string;
  selectedInverterId: string;
  selectedBatteryId?: string;
  selectedOptimizerId?: string;
  
  // Localização (para cálculo de geração)
  city: string;
  state: string;
  
  // Financeiro
  equipmentCost: number;
  installationCost: number;
  projectCost: number;
  
  // Configurações
  validityDays?: number;
  notes?: string;
}
