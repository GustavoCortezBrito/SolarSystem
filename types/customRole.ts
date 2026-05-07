// ============================================
// TIPOS DE CARGOS CUSTOMIZADOS
// ============================================

import { Permission } from "./auth";

/**
 * Cargo customizado criado pelo OWNER
 */
export interface CustomRole {
  id: string;
  companyId: string;
  name: string;                    // Nome do cargo (ex: "Instalador", "Engenheiro")
  description: string;
  permissions: Permission[];       // Permissões específicas
  color: string;                   // Cor do badge
  isDefault: boolean;              // Se é um cargo padrão (OWNER, ADMIN, etc)
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * Grupos de permissões para facilitar seleção
 */
export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

/**
 * Grupos de permissões pré-definidos
 */
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "leads",
    name: "Leads e Clientes",
    description: "Gerenciar leads e clientes",
    permissions: [
      Permission.LEADS_VIEW_ALL,
      Permission.LEADS_VIEW_OWN,
      Permission.LEADS_CREATE,
      Permission.LEADS_UPDATE,
      Permission.LEADS_DELETE,
      Permission.LEADS_ASSIGN,
    ],
  },
  {
    id: "boards",
    name: "Boards e Cards",
    description: "Gerenciar boards e cards",
    permissions: [
      Permission.BOARDS_VIEW_ALL,
      Permission.BOARDS_VIEW_OWN,
      Permission.BOARDS_CREATE,
      Permission.BOARDS_UPDATE,
      Permission.BOARDS_DELETE,
    ],
  },
  {
    id: "users",
    name: "Usuários e Equipe",
    description: "Gerenciar membros da equipe",
    permissions: [
      Permission.USERS_VIEW,
      Permission.USERS_INVITE,
      Permission.USERS_REMOVE,
      Permission.USERS_UPDATE_ROLE,
    ],
  },
  {
    id: "settings",
    name: "Configurações",
    description: "Configurações da empresa",
    permissions: [
      Permission.SETTINGS_VIEW,
      Permission.SETTINGS_UPDATE,
    ],
  },
  {
    id: "reports",
    name: "Relatórios",
    description: "Visualizar relatórios",
    permissions: [
      Permission.REPORTS_VIEW_ALL,
      Permission.REPORTS_VIEW_TEAM,
      Permission.REPORTS_VIEW_OWN,
    ],
  },
];

/**
 * Templates de cargos comuns
 */
export const ROLE_TEMPLATES: Omit<CustomRole, "id" | "companyId" | "createdAt" | "updatedAt" | "createdBy">[] = [
  {
    name: "Instalador",
    description: "Responsável pela instalação dos sistemas",
    permissions: [
      Permission.BOARDS_VIEW_OWN,
      Permission.BOARDS_UPDATE,
      Permission.LEADS_VIEW_OWN,
      Permission.LEADS_UPDATE,
    ],
    color: "bg-orange-100 text-orange-800",
    isDefault: false,
  },
  {
    name: "Engenheiro",
    description: "Responsável por dimensionamento e projetos técnicos",
    permissions: [
      Permission.BOARDS_VIEW_ALL,
      Permission.BOARDS_CREATE,
      Permission.BOARDS_UPDATE,
      Permission.LEADS_VIEW_ALL,
      Permission.LEADS_UPDATE,
      Permission.REPORTS_VIEW_TEAM,
    ],
    color: "bg-indigo-100 text-indigo-800",
    isDefault: false,
  },
  {
    name: "Atendente",
    description: "Atendimento e suporte ao cliente",
    permissions: [
      Permission.LEADS_VIEW_OWN,
      Permission.LEADS_CREATE,
      Permission.LEADS_UPDATE,
      Permission.BOARDS_VIEW_OWN,
      Permission.BOARDS_UPDATE,
    ],
    color: "bg-pink-100 text-pink-800",
    isDefault: false,
  },
  {
    name: "Coordenador",
    description: "Coordena equipes e projetos",
    permissions: [
      Permission.LEADS_VIEW_ALL,
      Permission.LEADS_CREATE,
      Permission.LEADS_UPDATE,
      Permission.LEADS_ASSIGN,
      Permission.BOARDS_VIEW_ALL,
      Permission.BOARDS_CREATE,
      Permission.BOARDS_UPDATE,
      Permission.USERS_VIEW,
      Permission.REPORTS_VIEW_TEAM,
    ],
    color: "bg-teal-100 text-teal-800",
    isDefault: false,
  },
];
