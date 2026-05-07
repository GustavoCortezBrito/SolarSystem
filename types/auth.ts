// ============================================
// TIPOS DE AUTENTICAÇÃO E AUTORIZAÇÃO
// ============================================

/**
 * Roles disponíveis no sistema
 * Hierarquia: OWNER > ADMIN > MANAGER > SELLER
 */
export enum Role {
  OWNER = "OWNER",     // Dono da empresa - acesso total
  ADMIN = "ADMIN",     // Administrador - quase tudo
  MANAGER = "MANAGER", // Gerente - gestão de equipe
  SELLER = "SELLER",   // Vendedor - apenas seus leads
}

/**
 * Status do membro na empresa
 */
export enum MembershipStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING", // Convite enviado mas não aceito
}

/**
 * Planos de assinatura
 */
export enum SubscriptionPlan {
  TRIAL = "TRIAL",           // Período de teste (14 dias)
  STARTER = "STARTER",       // Plano inicial
  PROFESSIONAL = "PROFESSIONAL", // Plano profissional
  ENTERPRISE = "ENTERPRISE", // Plano empresarial
}

/**
 * Status da assinatura
 */
export enum SubscriptionStatus {
  TRIAL = "TRIAL",           // Em período de teste
  ACTIVE = "ACTIVE",         // Ativa e paga
  PAST_DUE = "PAST_DUE",    // Pagamento atrasado
  CANCELED = "CANCELED",     // Cancelada
  EXPIRED = "EXPIRED",       // Expirada
}

/**
 * Usuário - Pessoa física que faz login
 * Um usuário pode estar em múltiplas empresas
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Não retornar em APIs
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Empresa/Organização - Cliente do SaaS
 */
export interface Company {
  id: string;
  name: string;
  slug: string; // URL amigável: solarsystem.com/empresa-abc
  logo?: string;
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: string; // Data de fim do trial
  subscriptionEndsAt?: string; // Data de fim da assinatura
  maxUsers: number;
  maxBoards: number;
  settings: CompanySettings;
  createdAt: string;
  updatedAt: string;
  
  // Dados da empresa para propostas
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  
  // Redes sociais
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  
  // Configurações de proposta
  proposalValidityDays?: number; // Validade padrão da proposta (ex: 7 dias)
  proposalFooter?: string; // Texto do rodapé da proposta
}

/**
 * Configurações da empresa
 */
export interface CompanySettings {
  timezone: string;
  currency: string;
  language: string;
  features: {
    dimensionamento: boolean;
    propostas: boolean;
    automacoes: boolean;
    integracao_whatsapp: boolean;
  };
}

/**
 * Membership - Liga usuário à empresa com role específico
 * IMPORTANTE: Um usuário pode ter roles diferentes em empresas diferentes
 */
export interface Membership {
  id: string;
  userId: string;
  companyId: string;
  role: Role;
  status: MembershipStatus;
  invitedBy?: string; // ID do usuário que convidou
  invitedAt?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Convite para usuário entrar na empresa
 */
export interface Invite {
  id: string;
  email: string;
  companyId: string;
  role: Role;
  invitedBy: string; // ID do usuário que convidou
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}

/**
 * Contexto do usuário autenticado
 * Usado em toda a aplicação para verificar permissões
 */
export interface AuthContext {
  user: User;
  company: Company;
  membership: Membership;
  permissions: Permission[];
}

/**
 * Permissões específicas (para futuro)
 * Por enquanto usamos apenas roles, mas isso permite granularidade
 */
export enum Permission {
  // Leads
  LEADS_VIEW_ALL = "leads.view_all",
  LEADS_VIEW_OWN = "leads.view_own",
  LEADS_CREATE = "leads.create",
  LEADS_UPDATE = "leads.update",
  LEADS_DELETE = "leads.delete",
  LEADS_ASSIGN = "leads.assign",

  // Usuários
  USERS_VIEW = "users.view",
  USERS_INVITE = "users.invite",
  USERS_REMOVE = "users.remove",
  USERS_UPDATE_ROLE = "users.update_role",

  // Boards
  BOARDS_VIEW_ALL = "boards.view_all",
  BOARDS_VIEW_OWN = "boards.view_own",
  BOARDS_CREATE = "boards.create",
  BOARDS_UPDATE = "boards.update",
  BOARDS_DELETE = "boards.delete",

  // Configurações
  SETTINGS_VIEW = "settings.view",
  SETTINGS_UPDATE = "settings.update",

  // Faturamento
  BILLING_VIEW = "billing.view",
  BILLING_MANAGE = "billing.manage",

  // Empresa
  COMPANY_UPDATE = "company.update",
  COMPANY_DELETE = "company.delete",

  // Relatórios
  REPORTS_VIEW_ALL = "reports.view_all",
  REPORTS_VIEW_TEAM = "reports.view_team",
  REPORTS_VIEW_OWN = "reports.view_own",
}

/**
 * Mapeamento de roles para permissões
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.OWNER]: [
    // Acesso total a tudo
    Permission.LEADS_VIEW_ALL,
    Permission.LEADS_CREATE,
    Permission.LEADS_UPDATE,
    Permission.LEADS_DELETE,
    Permission.LEADS_ASSIGN,
    Permission.USERS_VIEW,
    Permission.USERS_INVITE,
    Permission.USERS_REMOVE,
    Permission.USERS_UPDATE_ROLE,
    Permission.BOARDS_VIEW_ALL,
    Permission.BOARDS_CREATE,
    Permission.BOARDS_UPDATE,
    Permission.BOARDS_DELETE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_UPDATE,
    Permission.BILLING_VIEW,
    Permission.BILLING_MANAGE,
    Permission.COMPANY_UPDATE,
    Permission.COMPANY_DELETE,
    Permission.REPORTS_VIEW_ALL,
  ],

  [Role.ADMIN]: [
    // Quase tudo, exceto billing e deletar empresa
    Permission.LEADS_VIEW_ALL,
    Permission.LEADS_CREATE,
    Permission.LEADS_UPDATE,
    Permission.LEADS_DELETE,
    Permission.LEADS_ASSIGN,
    Permission.USERS_VIEW,
    Permission.USERS_INVITE,
    Permission.USERS_REMOVE,
    Permission.USERS_UPDATE_ROLE,
    Permission.BOARDS_VIEW_ALL,
    Permission.BOARDS_CREATE,
    Permission.BOARDS_UPDATE,
    Permission.BOARDS_DELETE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_UPDATE,
    Permission.COMPANY_UPDATE,
    Permission.REPORTS_VIEW_ALL,
  ],

  [Role.MANAGER]: [
    // Gestão de equipe e visualização ampla
    Permission.LEADS_VIEW_ALL,
    Permission.LEADS_CREATE,
    Permission.LEADS_UPDATE,
    Permission.LEADS_ASSIGN,
    Permission.USERS_VIEW,
    Permission.BOARDS_VIEW_ALL,
    Permission.BOARDS_CREATE,
    Permission.BOARDS_UPDATE,
    Permission.SETTINGS_VIEW,
    Permission.REPORTS_VIEW_TEAM,
  ],

  [Role.SELLER]: [
    // Apenas seus próprios leads e boards
    Permission.LEADS_VIEW_OWN,
    Permission.LEADS_CREATE,
    Permission.LEADS_UPDATE,
    Permission.BOARDS_VIEW_OWN,
    Permission.BOARDS_CREATE,
    Permission.BOARDS_UPDATE,
    Permission.REPORTS_VIEW_OWN,
  ],
};

/**
 * Limites por plano de assinatura
 */
export const PLAN_LIMITS: Record<
  SubscriptionPlan,
  {
    name: string;
    price: number; // Preço mensal em R$
    maxUsers: number;
    maxBoards: number;
    maxLeadsPerMonth: number;
    features: string[];
  }
> = {
  [SubscriptionPlan.TRIAL]: {
    name: "Período de Teste",
    price: 0,
    maxUsers: 5,
    maxBoards: 3,
    maxLeadsPerMonth: 100,
    features: ["board_basico", "dimensionamento", "propostas"],
  },
  [SubscriptionPlan.STARTER]: {
    name: "Starter",
    price: 97,
    maxUsers: 5,
    maxBoards: 3,
    maxLeadsPerMonth: 200,
    features: ["board_basico", "dimensionamento", "propostas"],
  },
  [SubscriptionPlan.PROFESSIONAL]: {
    name: "Professional",
    price: 297,
    maxUsers: 15,
    maxBoards: 10,
    maxLeadsPerMonth: 1000,
    features: [
      "board_basico",
      "dimensionamento",
      "propostas",
      "automacoes",
      "integracao_whatsapp",
      "relatorios_avancados",
    ],
  },
  [SubscriptionPlan.ENTERPRISE]: {
    name: "Enterprise",
    price: 997,
    maxUsers: -1, // Ilimitado
    maxBoards: -1, // Ilimitado
    maxLeadsPerMonth: -1, // Ilimitado
    features: [
      "board_basico",
      "dimensionamento",
      "propostas",
      "automacoes",
      "integracao_whatsapp",
      "relatorios_avancados",
      "api_acesso",
      "suporte_prioritario",
      "white_label",
    ],
  },
};
