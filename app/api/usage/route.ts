import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/usage?companyId=xxx
 * Retorna uso atual vs limites do plano
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se usuário pertence à empresa
    const membership = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Você não tem acesso a esta empresa" },
        { status: 403 }
      );
    }

    // Buscar dados da empresa com contagens
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: {
          select: {
            members: true,
            clients: true,
            boards: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Empresa não encontrada" },
        { status: 404 }
      );
    }

    // Calcular storage usado (soma de todos os arquivos)
    const filesStats = await prisma.fileUpload.aggregate({
      where: {
        companyId,
        deletedAt: null, // Apenas arquivos não deletados
      },
      _sum: {
        fileSize: true,
      },
      _count: true,
    });

    const totalBytes = filesStats._sum.fileSize || 0;
    const storageUsedGB = totalBytes / (1024 * 1024 * 1024);

    // Atualizar storage usado no banco (cache)
    await prisma.company.update({
      where: { id: companyId },
      data: { storageUsedGB },
    });

    // Contar projetos ativos (cards no board)
    const activeProjects = await prisma.card.count({
      where: {
        column: {
          board: {
            companyId,
          },
        },
      },
    });

    // Calcular percentuais de uso
    const usagePercentages = {
      users: ((company._count.members / company.maxUsers) * 100).toFixed(1),
      clients: ((company._count.clients / company.maxClients) * 100).toFixed(1),
      projects: ((activeProjects / company.maxProjects) * 100).toFixed(1),
      storage: ((storageUsedGB / company.storageQuotaGB) * 100).toFixed(1),
    };

    // Verificar se está próximo dos limites (>80%)
    const warnings = [];
    if (parseFloat(usagePercentages.users) > 80) {
      warnings.push({
        type: "users",
        message: `Você está usando ${usagePercentages.users}% do limite de usuários`,
      });
    }
    if (parseFloat(usagePercentages.clients) > 80) {
      warnings.push({
        type: "clients",
        message: `Você está usando ${usagePercentages.clients}% do limite de clientes`,
      });
    }
    if (parseFloat(usagePercentages.storage) > 80) {
      warnings.push({
        type: "storage",
        message: `Você está usando ${usagePercentages.storage}% do armazenamento`,
      });
    }

    // Calcular dias restantes do trial
    let trialDaysLeft = null;
    if (company.subscriptionStatus === "trial" && company.trialEndsAt) {
      const now = new Date();
      const trialEnd = new Date(company.trialEndsAt);
      trialDaysLeft = Math.ceil(
        (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return NextResponse.json({
      plan: {
        name: company.plan,
        status: company.subscriptionStatus,
        billingCycle: company.billingCycle,
        trialDaysLeft,
        nextBillingDate: company.nextBillingDate,
      },
      limits: {
        users: company.maxUsers,
        clients: company.maxClients,
        projects: company.maxProjects,
        storageGB: company.storageQuotaGB,
      },
      usage: {
        users: company._count.members,
        clients: company._count.clients,
        projects: activeProjects,
        storageGB: storageUsedGB.toFixed(2),
        files: filesStats._count,
      },
      percentages: usagePercentages,
      warnings,
      canUpgrade: company.plan !== "ENTERPRISE",
    });
  } catch (error) {
    console.error("Erro ao buscar uso:", error);
    return NextResponse.json(
      { error: "Erro ao buscar informações de uso" },
      { status: 500 }
    );
  }
}
