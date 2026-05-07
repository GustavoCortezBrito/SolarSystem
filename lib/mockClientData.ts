// ============================================
// DADOS MOCKADOS - CLIENTES
// ============================================

import { Client, ClientActivity, ClientType, ClientStatus, ActivityType } from "@/types/client";

/**
 * Clientes da Solar Tech Ltda
 */
export const mockClients: Client[] = [
  {
    id: "client-1",
    companyId: "company-1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+55 11 98765-1111",
    document: "123.456.789-00",
    type: ClientType.RESIDENTIAL,
    status: ClientStatus.LEAD,
    address: {
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
    },
    averageConsumption: 350,
    roofType: "Cerâmica",
    systemType: "On-grid",
    estimatedPower: 5,
    assignedToId: "user-4", // Maria (SELLER)
    tags: ["Urgente", "Indicação"],
    projectIds: ["prop-1"],
    estimatedValue: 25000,
    source: "Google Ads",
    notes: "Cliente muito interessado, quer instalar o quanto antes.",
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-05-04T14:30:00Z",
    createdBy: "user-1",
    lastContactAt: "2026-05-04T14:30:00Z",
  },
  {
    id: "client-2",
    companyId: "company-1",
    name: "Empresa ABC Ltda",
    email: "contato@empresaabc.com",
    phone: "+55 11 3456-7890",
    document: "12.345.678/0001-90",
    type: ClientType.COMMERCIAL,
    status: ClientStatus.PROPOSAL,
    address: {
      street: "Av. Paulista",
      number: "1000",
      complement: "Sala 501",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    },
    averageConsumption: 2500,
    roofType: "Laje",
    systemType: "On-grid",
    estimatedPower: 50,
    assignedToId: "user-3", // Pedro (MANAGER)
    tags: ["Grande Porte", "Financiamento"],
    projectIds: ["prop-2"],
    estimatedValue: 250000,
    proposalValue: 245000,
    source: "Indicação",
    notes: "Empresa de varejo, interessada em financiamento em 48x.",
    createdAt: "2026-05-02T09:15:00Z",
    updatedAt: "2026-05-03T16:20:00Z",
    createdBy: "user-2",
    lastContactAt: "2026-05-03T16:20:00Z",
  },
  {
    id: "client-3",
    companyId: "company-1",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+55 11 98765-2222",
    document: "987.654.321-00",
    type: ClientType.RESIDENTIAL,
    status: ClientStatus.NEGOTIATION,
    address: {
      street: "Rua dos Pinheiros",
      number: "456",
      neighborhood: "Pinheiros",
      city: "São Paulo",
      state: "SP",
      zipCode: "05422-000",
    },
    averageConsumption: 450,
    roofType: "Metálica",
    systemType: "Híbrido",
    estimatedPower: 8,
    assignedToId: "user-4",
    tags: ["Híbrido", "Baterias"],
    projectIds: [],
    estimatedValue: 45000,
    proposalValue: 42000,
    source: "Facebook Ads",
    notes: "Quer sistema híbrido com baterias para backup.",
    createdAt: "2026-04-28T08:00:00Z",
    updatedAt: "2026-05-04T10:15:00Z",
    createdBy: "user-4",
    lastContactAt: "2026-05-04T10:15:00Z",
  },
  {
    id: "client-4",
    companyId: "company-1",
    name: "Indústria XYZ S.A.",
    email: "projetos@industriaxyz.com",
    phone: "+55 11 3333-4444",
    document: "98.765.432/0001-10",
    type: ClientType.INDUSTRIAL,
    status: ClientStatus.WON,
    address: {
      street: "Rodovia dos Bandeirantes",
      number: "Km 25",
      neighborhood: "Distrito Industrial",
      city: "Jundiaí",
      state: "SP",
      zipCode: "13200-000",
    },
    averageConsumption: 15000,
    roofType: "Metálica",
    systemType: "On-grid",
    estimatedPower: 100,
    assignedToId: "user-3",
    tags: ["Industrial", "Grande Porte", "Fechado"],
    projectIds: [],
    estimatedValue: 500000,
    proposalValue: 480000,
    closedValue: 475000,
    source: "Indicação",
    notes: "Projeto fechado! Instalação programada para junho.",
    createdAt: "2026-04-25T10:00:00Z",
    updatedAt: "2026-05-04T15:45:00Z",
    createdBy: "user-2",
    lastContactAt: "2026-05-04T15:45:00Z",
  },
  {
    id: "client-5",
    companyId: "company-1",
    name: "Fazenda Solar",
    email: "contato@fazendasolar.com",
    phone: "+55 19 98888-7777",
    document: "11.222.333/0001-44",
    type: ClientType.RURAL,
    status: ClientStatus.CONTACT,
    address: {
      street: "Estrada Municipal",
      number: "S/N",
      neighborhood: "Zona Rural",
      city: "Campinas",
      state: "SP",
      zipCode: "13000-000",
    },
    averageConsumption: 5000,
    systemType: "Off-grid",
    estimatedPower: 30,
    assignedToId: "user-4",
    tags: ["Rural", "Off-grid", "Irrigação"],
    projectIds: [],
    estimatedValue: 180000,
    source: "Site",
    notes: "Fazenda sem acesso à rede elétrica, precisa de sistema off-grid para irrigação.",
    createdAt: "2026-05-03T11:00:00Z",
    updatedAt: "2026-05-03T11:00:00Z",
    createdBy: "user-3",
    lastContactAt: "2026-05-03T11:00:00Z",
  },
];

/**
 * Atividades dos clientes (histórico)
 */
export const mockClientActivities: ClientActivity[] = [
  {
    id: "activity-1",
    clientId: "client-1",
    userId: "user-1",
    userName: "Carlos Silva",
    type: ActivityType.CREATED,
    description: "Cliente criado no sistema",
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "activity-2",
    clientId: "client-1",
    userId: "user-4",
    userName: "Maria Oliveira",
    type: ActivityType.CALL,
    description: "Ligação realizada - Cliente muito interessado",
    metadata: { duration: "15 minutos" },
    createdAt: "2026-05-02T14:30:00Z",
  },
  {
    id: "activity-3",
    clientId: "client-1",
    userId: "user-4",
    userName: "Maria Oliveira",
    type: ActivityType.STATUS_CHANGE,
    description: "Status alterado de LEAD para CONTACT",
    metadata: { from: "LEAD", to: "CONTACT" },
    createdAt: "2026-05-02T14:35:00Z",
  },
  {
    id: "activity-4",
    clientId: "client-2",
    userId: "user-2",
    userName: "Ana Costa",
    type: ActivityType.CREATED,
    description: "Cliente criado no sistema",
    createdAt: "2026-05-02T09:15:00Z",
  },
  {
    id: "activity-5",
    clientId: "client-2",
    userId: "user-3",
    userName: "Pedro Santos",
    type: ActivityType.MEETING,
    description: "Reunião presencial realizada na empresa do cliente",
    metadata: { location: "Av. Paulista, 1000" },
    createdAt: "2026-05-03T10:00:00Z",
  },
  {
    id: "activity-6",
    clientId: "client-2",
    userId: "user-3",
    userName: "Pedro Santos",
    type: ActivityType.PROPOSAL_SENT,
    description: "Proposta comercial enviada por email",
    metadata: { value: 245000 },
    createdAt: "2026-05-03T16:20:00Z",
  },
  {
    id: "activity-7",
    clientId: "client-4",
    userId: "user-3",
    userName: "Pedro Santos",
    type: ActivityType.CONTRACT_SIGNED,
    description: "Contrato assinado digitalmente",
    metadata: { value: 475000 },
    createdAt: "2026-05-04T15:45:00Z",
  },
];

/**
 * Helper para obter atividades de um cliente
 */
export function getClientActivities(clientId: string): ClientActivity[] {
  return mockClientActivities
    .filter((activity) => activity.clientId === clientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Helper para obter clientes de uma empresa
 */
export function getCompanyClients(companyId: string): Client[] {
  return mockClients.filter((client) => client.companyId === companyId);
}

/**
 * Helper para obter clientes atribuídos a um usuário
 */
export function getUserClients(userId: string): Client[] {
  return mockClients.filter((client) => client.assignedToId === userId);
}

/**
 * Helper para obter cliente por ID
 */
export function getClientById(clientId: string): Client | undefined {
  return mockClients.find((client) => client.id === clientId);
}

/**
 * Labels amigáveis para tipos de cliente
 */
export function getClientTypeLabel(type: ClientType): string {
  const labels: Record<ClientType, string> = {
    [ClientType.RESIDENTIAL]: "Residencial",
    [ClientType.COMMERCIAL]: "Comercial",
    [ClientType.INDUSTRIAL]: "Industrial",
    [ClientType.RURAL]: "Rural/Agronegócio",
  };
  return labels[type];
}

/**
 * Labels amigáveis para status de cliente
 */
export function getClientStatusLabel(status: ClientStatus): string {
  const labels: Record<ClientStatus, string> = {
    [ClientStatus.LEAD]: "Lead",
    [ClientStatus.CONTACT]: "Em Contato",
    [ClientStatus.QUALIFIED]: "Qualificado",
    [ClientStatus.PROPOSAL]: "Proposta Enviada",
    [ClientStatus.NEGOTIATION]: "Em Negociação",
    [ClientStatus.WON]: "Cliente",
    [ClientStatus.LOST]: "Perdido",
    [ClientStatus.INACTIVE]: "Inativo",
  };
  return labels[status];
}

/**
 * Cores para status de cliente
 */
export function getClientStatusColor(status: ClientStatus): string {
  const colors: Record<ClientStatus, string> = {
    [ClientStatus.LEAD]: "bg-gray-100 text-gray-800",
    [ClientStatus.CONTACT]: "bg-blue-100 text-blue-800",
    [ClientStatus.QUALIFIED]: "bg-cyan-100 text-cyan-800",
    [ClientStatus.PROPOSAL]: "bg-purple-100 text-purple-800",
    [ClientStatus.NEGOTIATION]: "bg-yellow-100 text-yellow-800",
    [ClientStatus.WON]: "bg-green-100 text-green-800",
    [ClientStatus.LOST]: "bg-red-100 text-red-800",
    [ClientStatus.INACTIVE]: "bg-gray-100 text-gray-600",
  };
  return colors[status];
}

/**
 * Ícones para tipos de atividade
 */
export function getActivityIcon(type: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    // Sistema
    [ActivityType.CREATED]: "✨",
    [ActivityType.UPDATED]: "📝",
    [ActivityType.STATUS_CHANGE]: "🔄",
    
    // Interações
    [ActivityType.CALL]: "📞",
    [ActivityType.EMAIL]: "📧",
    [ActivityType.WHATSAPP]: "💬",
    [ActivityType.MEETING]: "🤝",
    [ActivityType.NOTE]: "📌",
    
    // Documentos
    [ActivityType.PROPOSAL_SENT]: "📄",
    [ActivityType.CONTRACT_SIGNED]: "✅",
    
    // Processo técnico
    [ActivityType.DIMENSIONING]: "📊",
    [ActivityType.INSTALLATION]: "🏗️",
    [ActivityType.INSPECTION]: "✅",
    
    // Financeiro
    [ActivityType.PAYMENT]: "💰",
    
    // Board
    [ActivityType.CARD_ASSIGNED]: "📋",
    [ActivityType.CARD_MOVED]: "➡️",
  };
  return icons[type] || "📝";
}
