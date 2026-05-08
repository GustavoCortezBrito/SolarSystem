import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - Listar empresas do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Buscar empresas do usuário através dos memberships
    const memberships = await prisma.companyMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        company: true,
      },
    });

    const companies = memberships.map((m) => ({
      ...m.company,
      role: m.role,
      membershipId: m.id,
    }));

    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar empresas" },
      { status: 500 }
    );
  }
}

// POST - Criar nova empresa
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Nome da empresa é obrigatório" },
        { status: 400 }
      );
    }

    // Criar empresa, membership e board em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar empresa
      const company = await tx.company.create({
        data: {
          name: name.trim(),
        },
      });

      // 2. Criar membership (usuário como OWNER da empresa)
      await tx.companyMember.create({
        data: {
          userId: session.user.id,
          companyId: company.id,
          role: "OWNER",
        },
      });

      // 3. Criar board padrão para a empresa
      await tx.board.create({
        data: {
          companyId: company.id,
          name: "Board Principal",
          columns: {
            create: [
              {
                title: "Novo Lead",
                color: "#3b82f6",
                order: 0,
                createdBy: session.user.id,
              },
              {
                title: "Qualificado",
                color: "#8b5cf6",
                order: 1,
                createdBy: session.user.id,
              },
              {
                title: "Proposta Enviada",
                color: "#f59e0b",
                order: 2,
                createdBy: session.user.id,
              },
              {
                title: "Negociação",
                color: "#10b981",
                order: 3,
                createdBy: session.user.id,
              },
              {
                title: "Ganho",
                color: "#22c55e",
                order: 4,
                createdBy: session.user.id,
              },
            ],
          },
        },
      });

      return company;
    });

    return NextResponse.json(
      {
        message: "Empresa criada com sucesso",
        company: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao criar empresa. Tente novamente." },
      { status: 500 }
    );
  }
}
