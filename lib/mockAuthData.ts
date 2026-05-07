// ============================================
// DADOS MOCKADOS - MULTI-TENANT
// ============================================

import {
  User,
  Company,
  Membership,
  Role,
  MembershipStatus,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/types/auth";

/**
 * Usuários do sistema
 * Nota: Alguns usuários estão em múltiplas empresas
 */
export const mockUsers: User[] = [
  // Empresa Solar Tech
  {
    id: "user-1",
    name: "Carlos Silva",
    email: "carlos@solartech.com",
    avatar: undefined,
    phone: "+55 11 98765-4321",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
  {
    id: "user-2",
    name: "Ana Costa",
    email: "ana@solartech.com",
    avatar: undefined,
    phone: "+55 11 98765-4322",
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
  {
    id: "user-3",
    name: "Pedro Santos",
    email: "pedro@solartech.com",
    avatar: undefined,
    phone: "+55 11 98765-4323",
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
  {
    id: "user-4",
    name: "Maria Oliveira",
    email: "maria@solartech.com",
    avatar: undefined,
    phone: "+55 11 98765-4324",
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },

  // Empresa Energia Verde
  {
    id: "user-5",
    name: "João Almeida",
    email: "joao@energiaverde.com",
    avatar: undefined,
    phone: "+55 21 98765-1111",
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
  {
    id: "user-6",
    name: "Juliana Lima",
    email: "juliana@energiaverde.com",
    avatar: undefined,
    phone: "+55 21 98765-2222",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
  {
    id: "user-7",
    name: "Roberto Ferreira",
    email: "roberto@energiaverde.com",
    avatar: undefined,
    phone: "+55 21 98765-3333",
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },

  // Usuário em múltiplas empresas
  {
    id: "user-8",
    name: "Gustavo Consultor",
    email: "gustavo@consultor.com",
    avatar: undefined,
    phone: "+55 11 99999-9999",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
];

/**
 * Empresas cadastradas no SaaS
 */
export const mockCompanies: Company[] = [
  {
    id: "company-1",
    name: "Solar Tech Ltda",
    slug: "solar-tech",
    logo: undefined,
    plan: SubscriptionPlan.PROFESSIONAL,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    subscriptionEndsAt: "2027-01-15T10:00:00Z",
    maxUsers: 15,
    maxBoards: 10,
    settings: {
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      language: "pt-BR",
      features: {
        dimensionamento: true,
        propostas: true,
        automacoes: true,
        integracao_whatsapp: true,
      },
    },
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
    
    // Dados para propostas
    cnpj: "12.345.678/0001-90",
    address: "Rua Antônio Rodrigues, 326 - Vila Militar",
    city: "Presidente Prudente",
    state: "SP",
    zipCode: "19030-330",
    phone: "(18) 99745-3744",
    whatsapp: "(18) 99745-3744",
    email: "contato@solartech.com.br",
    website: "www.solartechenergia.com.br",
    instagram: "@solartech",
    facebook: "SolarTech",
    linkedin: "company/solartech",
    proposalValidityDays: 7,
    proposalFooter: "Energia limpa e renovável para o seu futuro",
  },
  {
    id: "company-2",
    name: "Energia Verde S.A.",
    slug: "energia-verde",
    logo: undefined,
    plan: SubscriptionPlan.TRIAL,
    subscriptionStatus: SubscriptionStatus.TRIAL,
    trialEndsAt: "2026-05-18T08:00:00Z", // 14 dias após criação
    maxUsers: 5,
    maxBoards: 3,
    settings: {
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      language: "pt-BR",
      features: {
        dimensionamento: true,
        propostas: true,
        automacoes: false,
        integracao_whatsapp: false,
      },
    },
    createdAt: "2026-05-04T08:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
  {
    id: "company-3",
    name: "Sol do Brasil",
    slug: "sol-do-brasil",
    logo: undefined,
    plan: SubscriptionPlan.STARTER,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    subscriptionEndsAt: "2026-06-20T15:00:00Z",
    maxUsers: 5,
    maxBoards: 3,
    settings: {
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      language: "pt-BR",
      features: {
        dimensionamento: true,
        propostas: true,
        automacoes: false,
        integracao_whatsapp: false,
      },
    },
    createdAt: "2026-03-20T15:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
];

/**
 * Memberships - Liga usuários às empresas com roles
 * IMPORTANTE: Note que user-8 (Gustavo) está em 2 empresas com roles diferentes
 */
export const mockMemberships: Membership[] = [
  // Solar Tech Ltda
  {
    id: "membership-1",
    userId: "user-1",
    companyId: "company-1",
    role: Role.OWNER,
    status: MembershipStatus.ACTIVE,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "membership-2",
    userId: "user-2",
    companyId: "company-1",
    role: Role.ADMIN,
    status: MembershipStatus.ACTIVE,
    invitedBy: "user-1",
    invitedAt: "2026-01-15T10:30:00Z",
    acceptedAt: "2026-01-15T11:00:00Z",
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-01-15T11:00:00Z",
  },
  {
    id: "membership-3",
    userId: "user-3",
    companyId: "company-1",
    role: Role.MANAGER,
    status: MembershipStatus.ACTIVE,
    invitedBy: "user-1",
    invitedAt: "2026-01-20T09:00:00Z",
    acceptedAt: "2026-01-20T10:00:00Z",
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "membership-4",
    userId: "user-4",
    companyId: "company-1",
    role: Role.SELLER,
    status: MembershipStatus.ACTIVE,
    invitedBy: "user-2",
    invitedAt: "2026-02-01T14:00:00Z",
    acceptedAt: "2026-02-01T15:00:00Z",
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-02-01T15:00:00Z",
  },
  {
    id: "membership-5",
    userId: "user-8", // Gustavo - OWNER na Solar Tech
    companyId: "company-1",
    role: Role.OWNER,
    status: MembershipStatus.ACTIVE,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },

  // Energia Verde S.A.
  {
    id: "membership-6",
    userId: "user-5",
    companyId: "company-2",
    role: Role.OWNER,
    status: MembershipStatus.ACTIVE,
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "membership-7",
    userId: "user-6",
    companyId: "company-2",
    role: Role.MANAGER,
    status: MembershipStatus.ACTIVE,
    invitedBy: "user-5",
    invitedAt: "2026-02-15T10:00:00Z",
    acceptedAt: "2026-02-15T11:00:00Z",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T11:00:00Z",
  },
  {
    id: "membership-8",
    userId: "user-7",
    companyId: "company-2",
    role: Role.SELLER,
    status: MembershipStatus.ACTIVE,
    invitedBy: "user-5",
    invitedAt: "2026-03-01T11:00:00Z",
    acceptedAt: "2026-03-01T12:00:00Z",
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: "2026-03-01T12:00:00Z",
  },
  {
    id: "membership-9",
    userId: "user-8", // Gustavo - SELLER na Energia Verde
    companyId: "company-2",
    role: Role.SELLER,
    status: MembershipStatus.ACTIVE,
    invitedBy: "user-5",
    invitedAt: "2026-02-20T09:00:00Z",
    acceptedAt: "2026-02-20T10:00:00Z",
    createdAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
  },

  // Sol do Brasil (plano free - apenas 2 usuários)
  {
    id: "membership-10",
    userId: "user-1", // Carlos também está aqui como consultor
    companyId: "company-3",
    role: Role.OWNER,
    status: MembershipStatus.ACTIVE,
    createdAt: "2026-03-20T15:00:00Z",
    updatedAt: "2026-03-20T15:00:00Z",
  },
];

/**
 * Helper para obter membership de um usuário em uma empresa
 */
export function getMembership(
  userId: string,
  companyId: string
): Membership | undefined {
  return mockMemberships.find(
    (m) => m.userId === userId && m.companyId === companyId
  );
}

/**
 * Helper para obter todas as empresas de um usuário
 */
export function getUserCompanies(userId: string): Company[] {
  const userMemberships = mockMemberships.filter((m) => m.userId === userId);
  return userMemberships
    .map((m) => mockCompanies.find((c) => c.id === m.companyId))
    .filter((c): c is Company => c !== undefined);
}

/**
 * Helper para obter todos os membros de uma empresa
 */
export function getCompanyMembers(companyId: string): Array<{
  user: User;
  membership: Membership;
}> {
  const companyMemberships = mockMemberships.filter(
    (m) => m.companyId === companyId && m.status === MembershipStatus.ACTIVE
  );

  return companyMemberships
    .map((membership) => {
      const user = mockUsers.find((u) => u.id === membership.userId);
      if (!user) return null;
      return { user, membership };
    })
    .filter((item): item is { user: User; membership: Membership } => item !== null);
}

/**
 * Simula usuário logado (para desenvolvimento)
 * Em produção, isso viria do sistema de autenticação
 */
export const CURRENT_USER_ID = "user-1"; // Carlos Silva - OWNER da Solar Tech
export const CURRENT_COMPANY_ID = "company-1"; // Solar Tech Ltda
