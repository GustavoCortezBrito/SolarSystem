// ============================================
// TIPOS DE CLIENTES
// ============================================

/**
 * Tipo de cliente
 */
export enum ClientType {
  RESIDENTIAL = "RESIDENTIAL",   // Residencial
  COMMERCIAL = "COMMERCIAL",     // Comercial
  INDUSTRIAL = "INDUSTRIAL",     // Industrial
  RURAL = "RURAL",              // Rural/Agronegócio
}

/**
 * Status do cliente
 */
export enum ClientStatus {
  LEAD = "LEAD",                 // Lead inicial
  CONTACT = "CONTACT",           // Em contato
  QUALIFIED = "QUALIFIED",       // Qualificado
  PROPOSAL = "PROPOSAL",         // Proposta enviada
  NEGOTIATION = "NEGOTIATION",   // Em negociação
  WON = "WON",                   // Ganho/Cliente
  LOST = "LOST",                 // Perdido
  INACTIVE = "INACTIVE",         // Inativo
}

/**
 * Cliente - Pessoa ou empresa que é atendida
 */
export interface Client {
  id: string;
  companyId: string;              // Empresa que possui este cliente
  
  // Dados básicos
  name: string;
  email: string;
  phone: string;
  document?: string;              // CPF ou CNPJ
  type: ClientType;
  status: ClientStatus;
  
  // Endereço
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Dados do projeto
  averageConsumption?: number;    // Consumo médio em kWh
  roofType?: string;              // Tipo de telhado
  roofArea?: number;              // Área do telhado em m²
  systemType?: string;            // On-grid, Off-grid, Híbrido
  estimatedPower?: number;        // Potência estimada em kWp
  
  // Relacionamentos
  assignedToId?: string;          // Vendedor responsável
  tags: string[];                 // Tags personalizadas
  projectIds: string[];           // IDs das propostas/projetos vinculados
  
  // Financeiro
  estimatedValue?: number;        // Valor estimado do projeto
  proposalValue?: number;         // Valor da proposta
  closedValue?: number;           // Valor fechado
  
  // Metadados
  source?: string;                // Origem do lead (Google Ads, Indicação, etc)
  notes?: string;                 // Observações gerais
  createdAt: string;
  updatedAt: string;
  createdBy: string;              // Usuário que criou
  lastContactAt?: string;         // Último contato
}

/**
 * Atividade do cliente (histórico)
 */
export interface ClientActivity {
  id: string;
  clientId: string;
  userId: string;                 // Quem fez a ação
  userName: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>; // Dados adicionais
  createdAt: string;
}

/**
 * Tipos de atividade
 */
export enum ActivityType {
  // Atividades do sistema
  CREATED = "CREATED",           // Cliente criado
  UPDATED = "UPDATED",           // Dados atualizados
  STATUS_CHANGE = "STATUS_CHANGE", // Status alterado (automático)
  
  // Interações
  CALL = "CALL",                 // Ligação telefônica
  EMAIL = "EMAIL",               // Email enviado
  WHATSAPP = "WHATSAPP",         // Mensagem WhatsApp
  MEETING = "MEETING",           // Reunião presencial/online
  NOTE = "NOTE",                 // Observação/Nota
  
  // Documentos e propostas
  PROPOSAL_SENT = "PROPOSAL_SENT", // Proposta enviada
  CONTRACT_SIGNED = "CONTRACT_SIGNED", // Contrato assinado
  
  // Processo técnico
  DIMENSIONING = "DIMENSIONING", // Dimensionamento realizado
  INSTALLATION = "INSTALLATION", // Instalação
  INSPECTION = "INSPECTION",     // Vistoria
  
  // Financeiro
  PAYMENT = "PAYMENT",           // Pagamento recebido
  
  // Board
  CARD_ASSIGNED = "CARD_ASSIGNED", // Card atribuído
  CARD_MOVED = "CARD_MOVED",     // Card movido
}

/**
 * Filtros de cliente
 */
export interface ClientFilters {
  search?: string;
  type?: ClientType;
  status?: ClientStatus;
  assignedToId?: string;
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
}
