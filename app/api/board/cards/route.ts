import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/board/cards - Criar card
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { columnId, title, description, clientId, clientName, tags, dueDate, order } = body;

    if (!columnId || !title) {
      return NextResponse.json(
        { error: "columnId e title são obrigatórios" },
        { status: 400 }
      );
    }

    const card = await prisma.card.create({
      data: {
        columnId,
        title,
        description,
        clientId,
        clientName,
        tags: tags || [],
        dueDate: dueDate ? new Date(dueDate) : null,
        order: order || 0,
        createdBy: session.user.id,
      },
      include: {
        client: {
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

    // Se vinculou cliente, criar atividade
    if (clientId) {
      await prisma.clientActivity.create({
        data: {
          clientId,
          userId: session.user.id,
          userName: session.user.name || "Sistema",
          type: "CARD_ASSIGNED",
          description: `Cliente vinculado ao card "${title}" no board`,
          metadata: { cardId: card.id },
        },
      });
    }

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar card:", error);
    return NextResponse.json(
      { error: "Erro ao criar card" },
      { status: 500 }
    );
  }
}

// PUT /api/board/cards - Atualizar card (mover entre colunas)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { cardId, columnId, order, title, description, clientId, clientName, tags, dueDate } = body;

    if (!cardId) {
      return NextResponse.json(
        { error: "cardId é obrigatório" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (columnId !== undefined) updateData.columnId = columnId;
    if (order !== undefined) updateData.order = order;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (clientId !== undefined) updateData.clientId = clientId;
    if (clientName !== undefined) updateData.clientName = clientName;
    if (tags !== undefined) updateData.tags = tags;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const card = await prisma.card.update({
      where: { id: cardId },
      data: updateData,
      include: {
        column: {
          select: {
            id: true,
            title: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    // Se moveu de coluna e tem cliente, atualizar status do cliente
    if (columnId && card.clientId) {
      const columnToStatus: Record<string, string> = {
        leads: "LEAD",
        dimensionamento: "QUALIFIED",
        proposta: "PROPOSAL",
        negociação: "NEGOTIATION",
        negociacao: "NEGOTIATION",
        instalação: "WON",
        instalacao: "WON",
        concluído: "WON",
        concluido: "WON",
      };

      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
      const newStatus = columnToStatus[normalize(card.column.title)];

      if (newStatus && card.client && newStatus !== card.client.status) {
        await prisma.client.update({
          where: { id: card.clientId },
          data: { status: newStatus, lastContactAt: new Date() },
        });

        await prisma.clientActivity.create({
          data: {
            clientId: card.clientId,
            userId: session.user.id,
            userName: session.user.name || "Sistema",
            type: "CARD_MOVED",
            description: `Card movido para "${card.column.title}"`,
            metadata: { cardId: card.id, columnTitle: card.column.title },
          },
        });
      }
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Erro ao atualizar card:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar card" },
      { status: 500 }
    );
  }
}
