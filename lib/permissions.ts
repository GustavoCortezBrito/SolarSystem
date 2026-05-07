// ============================================
// HELPERS DE PERMISSÕES
// ============================================

import {
  Role,
  Permission,
  ROLE_PERMISSIONS,
  AuthContext,
  Membership,
} from "@/types/auth";

/**
 * Verifica se um role tem uma permissão específica
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Verifica se o usuário autenticado tem uma permissão
 */
export function can(context: AuthContext, permission: Permission): boolean {
  return hasPermission(context.membership.role, permission);
}

/**
 * Verifica se o usuário tem qualquer uma das permissões listadas
 */
export function canAny(
  context: AuthContext,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => can(context, permission));
}

/**
 * Verifica se o usuário tem todas as permissões listadas
 */
export function canAll(
  context: AuthContext,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => can(context, permission));
}

/**
 * Verifica se o usuário é owner da empresa
 */
export function isOwner(context: AuthContext): boolean {
  return context.membership.role === Role.OWNER;
}

/**
 * Verifica se o usuário é owner ou admin
 */
export function isOwnerOrAdmin(context: AuthContext): boolean {
  return [Role.OWNER, Role.ADMIN].includes(context.membership.role);
}

/**
 * Verifica se o usuário pode ver todos os leads
 * (OWNER, ADMIN, MANAGER podem ver todos)
 */
export function canViewAllLeads(context: AuthContext): boolean {
  return can(context, Permission.LEADS_VIEW_ALL);
}

/**
 * Verifica se o usuário pode ver apenas seus próprios leads
 */
export function canViewOnlyOwnLeads(context: AuthContext): boolean {
  return (
    context.membership.role === Role.SELLER &&
    !can(context, Permission.LEADS_VIEW_ALL)
  );
}

/**
 * Verifica se o usuário pode gerenciar outros usuários
 */
export function canManageUsers(context: AuthContext): boolean {
  return can(context, Permission.USERS_INVITE);
}

/**
 * Verifica se o usuário pode gerenciar faturamento
 */
export function canManageBilling(context: AuthContext): boolean {
  return can(context, Permission.BILLING_MANAGE);
}

/**
 * Verifica se o usuário pode deletar a empresa
 */
export function canDeleteCompany(context: AuthContext): boolean {
  return can(context, Permission.COMPANY_DELETE);
}

/**
 * Obtém todas as permissões de um role
 */
export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Verifica se um role é superior a outro
 * Hierarquia: OWNER > ADMIN > MANAGER > SELLER
 */
export function isRoleHigherThan(role1: Role, role2: Role): boolean {
  const hierarchy = [Role.SELLER, Role.MANAGER, Role.ADMIN, Role.OWNER];
  return hierarchy.indexOf(role1) > hierarchy.indexOf(role2);
}

/**
 * Verifica se o usuário pode alterar o role de outro membro
 * Regra: Só pode alterar roles inferiores ao seu
 */
export function canChangeRole(
  context: AuthContext,
  targetRole: Role
): boolean {
  if (!can(context, Permission.USERS_UPDATE_ROLE)) {
    return false;
  }
  return isRoleHigherThan(context.membership.role, targetRole);
}

/**
 * Verifica se o usuário pode remover outro membro
 * Regra: Não pode remover membros com role igual ou superior
 */
export function canRemoveMember(
  context: AuthContext,
  targetMembership: Membership
): boolean {
  if (!can(context, Permission.USERS_REMOVE)) {
    return false;
  }

  // Não pode remover a si mesmo
  if (context.membership.id === targetMembership.id) {
    return false;
  }

  // Só pode remover roles inferiores
  return isRoleHigherThan(context.membership.role, targetMembership.role);
}

/**
 * Filtra leads baseado nas permissões do usuário
 * Retorna query filter para o banco de dados
 */
export function getLeadsFilter(context: AuthContext) {
  const baseFilter = {
    companyId: context.company.id,
  };

  // Se pode ver todos os leads, retorna apenas filtro de empresa
  if (canViewAllLeads(context)) {
    return baseFilter;
  }

  // Se só pode ver próprios leads, adiciona filtro de usuário
  return {
    ...baseFilter,
    assignedToId: context.user.id,
  };
}

/**
 * Filtra boards baseado nas permissões do usuário
 */
export function getBoardsFilter(context: AuthContext) {
  const baseFilter = {
    companyId: context.company.id,
  };

  // Se pode ver todos os boards
  if (can(context, Permission.BOARDS_VIEW_ALL)) {
    return baseFilter;
  }

  // Se só pode ver próprios boards
  return {
    ...baseFilter,
    OR: [
      { ownerId: context.user.id },
      { members: { some: { userId: context.user.id } } },
    ],
  };
}

/**
 * Obtém label amigável do role
 */
export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    [Role.OWNER]: "Proprietário",
    [Role.ADMIN]: "Administrador",
    [Role.MANAGER]: "Gerente",
    [Role.SELLER]: "Vendedor",
  };
  return labels[role];
}

/**
 * Obtém descrição do role
 */
export function getRoleDescription(role: Role): string {
  const descriptions: Record<Role, string> = {
    [Role.OWNER]:
      "Acesso total ao sistema, incluindo faturamento e exclusão da empresa",
    [Role.ADMIN]:
      "Acesso administrativo completo, exceto faturamento e exclusão da empresa",
    [Role.MANAGER]:
      "Pode gerenciar equipe, visualizar todos os leads e distribuir tarefas",
    [Role.SELLER]:
      "Acesso apenas aos próprios leads e funcionalidades básicas de vendas",
  };
  return descriptions[role];
}

/**
 * Obtém cor do badge do role (para UI)
 */
export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    [Role.OWNER]: "bg-purple-100 text-purple-800",
    [Role.ADMIN]: "bg-blue-100 text-blue-800",
    [Role.MANAGER]: "bg-green-100 text-green-800",
    [Role.SELLER]: "bg-gray-100 text-gray-800",
  };
  return colors[role];
}
