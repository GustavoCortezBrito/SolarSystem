import { prisma } from "@/lib/prisma";

/**
 * Verifica se a empresa pode adicionar mais usuários
 */
export async function checkUserLimit(companyId: string): Promise<boolean> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  if (!company) throw new Error("Empresa não encontrada");

  return company._count.members < company.maxUsers;
}

/**
 * Verifica se a empresa pode adicionar mais clientes
 */
export async function checkClientLimit(companyId: string): Promise<boolean> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      _count: {
        select: { clients: true },
      },
    },
  });

  if (!company) throw new Error("Empresa não encontrada");

  return company._count.clients < company.maxClients;
}

/**
 * Verifica se a empresa pode adicionar mais projetos
 */
export async function checkProjectLimit(companyId: string): Promise<boolean> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) throw new Error("Empresa não encontrada");

  // Contar cards ativos
  const activeProjects = await prisma.card.count({
    where: {
      column: {
        board: {
          companyId,
        },
      },
    },
  });

  return activeProjects < company.maxProjects;
}

/**
 * Verifica se a empresa tem espaço de armazenamento disponível
 */
export async function checkStorageLimit(
  companyId: string,
  fileSizeBytes: number
): Promise<{ allowed: boolean; message?: string }> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) throw new Error("Empresa não encontrada");

  // Calcular storage atual
  const filesStats = await prisma.fileUpload.aggregate({
    where: {
      companyId,
      deletedAt: null,
    },
    _sum: {
      fileSize: true,
    },
  });

  const currentBytes = filesStats._sum.fileSize || 0;
  const currentGB = currentBytes / (1024 * 1024 * 1024);
  const newFileGB = fileSizeBytes / (1024 * 1024 * 1024);
  const totalGB = currentGB + newFileGB;

  if (totalGB > company.storageQuotaGB) {
    return {
      allowed: false,
      message: `Limite de armazenamento atingido. Usado: ${totalGB.toFixed(
        2
      )} GB / ${company.storageQuotaGB} GB. Faça upgrade do seu plano.`,
    };
  }

  // Avisar se está próximo do limite (>90%)
  const percentage = (totalGB / company.storageQuotaGB) * 100;
  if (percentage > 90) {
    return {
      allowed: true,
      message: `Atenção: Você está usando ${percentage.toFixed(
        1
      )}% do seu armazenamento.`,
    };
  }

  return { allowed: true };
}

/**
 * Retorna informações do plano da empresa
 */
export async function getCompanyPlan(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      plan: true,
      maxUsers: true,
      maxClients: true,
      maxProjects: true,
      storageQuotaGB: true,
      subscriptionStatus: true,
      trialEndsAt: true,
    },
  });

  if (!company) throw new Error("Empresa não encontrada");

  return company;
}

/**
 * Verifica se a empresa está em trial expirado
 */
export async function isTrialExpired(companyId: string): Promise<boolean> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      subscriptionStatus: true,
      trialEndsAt: true,
    },
  });

  if (!company) throw new Error("Empresa não encontrada");

  if (company.subscriptionStatus !== "trial") return false;

  if (!company.trialEndsAt) return false;

  return new Date() > new Date(company.trialEndsAt);
}

/**
 * Planos disponíveis
 */
export const PLANS = {
  STARTER: {
    name: "Starter",
    maxUsers: 3,
    maxClients: 1000,
    maxProjects: 500,
    storageQuotaGB: 5,
    priceMonthly: 127,
    priceAnnual: 97,
  },
  PROFESSIONAL: {
    name: "Professional",
    maxUsers: 10,
    maxClients: 5000,
    maxProjects: 2000,
    storageQuotaGB: 25,
    priceMonthly: 297,
    priceAnnual: 247,
  },
  ENTERPRISE: {
    name: "Enterprise",
    maxUsers: 999999,
    maxClients: 999999,
    maxProjects: 999999,
    storageQuotaGB: 100,
    priceMonthly: 597,
    priceAnnual: 497,
  },
} as const;

export type PlanType = keyof typeof PLANS;
