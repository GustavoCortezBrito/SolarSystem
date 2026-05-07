import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/proposals - Listar propostas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        clientRel: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar propostas" },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Criar proposta
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      companyId,
      clientId,
      client,
      consumption,
      system,
      financial,
      status,
    } = body;

    // Validação
    if (!companyId || !client || !consumption || !system || !financial) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.create({
      data: {
        companyId,
        clientId: clientId || null,
        client,
        consumption,
        system,
        financial,
        status: status || "RASCUNHO",
        createdBy: session.user.id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        clientRel: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Se tiver cliente vinculado, atualizar
    if (clientId) {
      await prisma.client.update({
        where: { id: clientId },
        data: {
          status: "PROPOSAL",
          proposalValue: financial.totalCost,
          projectIds: {
            push: proposal.id,
          },
          lastContactAt: new Date(),
        },
      });

      // Criar atividade
      await prisma.clientActivity.create({
        data: {
          clientId,
          userId: session.user.id,
          userName: session.user.name || "Sistema",
          type: "PROPOSAL_SENT",
          description: `Proposta gerada: ${system.totalPower.toFixed(2)} kWp - R$ ${financial.totalCost.toLocaleString("pt-BR")}`,
          metadata: {
            proposalId: proposal.id,
            value: financial.totalCost,
          },
        },
      });
    }

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar proposta:", error);
    return NextResponse.json(
      { error: "Erro ao criar proposta" },
      { status: 500 }
    );
  }
}
