import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/proposals/[id] - Buscar proposta por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            logo: true,
          },
        },
        clientRel: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
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

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Erro ao buscar proposta:", error);
    return NextResponse.json(
      { error: "Erro ao buscar proposta" },
      { status: 500 }
    );
  }
}

// PUT /api/proposals/[id] - Atualizar proposta
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { client, consumption, system, financial, status } = body;

    const updateData: any = {};
    if (client) updateData.client = client;
    if (consumption) updateData.consumption = consumption;
    if (system) updateData.system = system;
    if (financial) updateData.financial = financial;
    if (status) {
      updateData.status = status;
      if (status === "ENVIADA") updateData.sentAt = new Date();
      if (status === "ACEITA") updateData.acceptedAt = new Date();
      if (status === "REJEITADA") updateData.rejectedAt = new Date();
    }

    const proposal = await prisma.proposal.update({
      where: { id: params.id },
      data: updateData,
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
      },
    });

    // Se mudou status e tem cliente vinculado, atualizar cliente
    if (status && proposal.clientId) {
      const clientUpdate: any = { lastContactAt: new Date() };
      
      if (status === "ACEITA") {
        clientUpdate.status = "WON";
        clientUpdate.closedValue = (financial || proposal.financial as any).totalCost;
      } else if (status === "REJEITADA") {
        clientUpdate.status = "LOST";
      }

      await prisma.client.update({
        where: { id: proposal.clientId },
        data: clientUpdate,
      });

      // Criar atividade
      await prisma.clientActivity.create({
        data: {
          clientId: proposal.clientId,
          userId: session.user.id,
          userName: session.user.name || "Sistema",
          type: "STATUS_CHANGE",
          description: `Proposta ${status === "ACEITA" ? "aceita" : status === "REJEITADA" ? "rejeitada" : "atualizada"}`,
          metadata: {
            proposalId: proposal.id,
            status,
          },
        },
      });
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Erro ao atualizar proposta:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar proposta" },
      { status: 500 }
    );
  }
}

// DELETE /api/proposals/[id] - Deletar proposta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await prisma.proposal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Proposta deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar proposta:", error);
    return NextResponse.json(
      { error: "Erro ao deletar proposta" },
      { status: 500 }
    );
  }
}
