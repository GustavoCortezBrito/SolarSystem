import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/board/import
 * Importa board do Trello (JSON export)
 * 
 * Estrutura esperada do JSON do Trello:
 * {
 *   name: string,
 *   lists: [{ id, name, closed }],
 *   cards: [{ id, name, desc, idList, labels, due, closed }]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { trelloData, companyId, replaceExisting = false } = body;

    if (!trelloData || !companyId) {
      return NextResponse.json(
        { error: "trelloData e companyId são obrigatórios" },
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

    // Buscar board existente
    let board = await prisma.board.findUnique({
      where: { companyId },
      include: { columns: true },
    });

    // Se replaceExisting, deletar colunas e cards existentes
    if (replaceExisting && board) {
      await prisma.card.deleteMany({
        where: {
          column: {
            boardId: board.id,
          },
        },
      });
      await prisma.column.deleteMany({
        where: { boardId: board.id },
      });
    }

    // Se não existe board, criar
    if (!board) {
      board = await prisma.board.create({
        data: {
          companyId,
          name: trelloData.name || "Board Importado",
        },
      });
    }

    // Processar listas do Trello (viram colunas)
    const lists = trelloData.lists || [];
    const activeLists = lists.filter((list: any) => !list.closed);
    
    const columnMap = new Map<string, string>(); // trelloListId -> columnId
    const colorPalette = [
      "#3b82f6", // blue
      "#8b5cf6", // purple
      "#f59e0b", // amber
      "#10b981", // emerald
      "#06b6d4", // cyan
      "#22c55e", // green
      "#ef4444", // red
      "#f97316", // orange
    ];

    for (let i = 0; i < activeLists.length; i++) {
      const list = activeLists[i];
      const column = await prisma.column.create({
        data: {
          boardId: board.id,
          title: list.name,
          color: colorPalette[i % colorPalette.length],
          order: i,
          createdBy: session.user.id,
        },
      });
      columnMap.set(list.id, column.id);
    }

    // Processar cards do Trello
    const cards = trelloData.cards || [];
    const activeCards = cards.filter((card: any) => !card.closed);
    
    let importedCardsCount = 0;
    let skippedCardsCount = 0;

    for (const trelloCard of activeCards) {
      const columnId = columnMap.get(trelloCard.idList);
      
      if (!columnId) {
        skippedCardsCount++;
        continue; // Lista não existe ou foi fechada
      }

      // Extrair tags das labels do Trello
      const tags = (trelloCard.labels || [])
        .map((label: any) => label.name)
        .filter((name: string) => name && name.trim() !== "");

      // Extrair nome do cliente da descrição ou título
      let clientName = null;
      const titleMatch = trelloCard.name.match(/^([^-]+)/);
      if (titleMatch) {
        clientName = titleMatch[1].trim();
      }

      // Criar card com mais informações
      await prisma.card.create({
        data: {
          columnId,
          title: trelloCard.name,
          description: trelloCard.desc || null,
          clientName,
          tags,
          dueDate: trelloCard.due ? new Date(trelloCard.due) : null,
          order: importedCardsCount,
          createdBy: session.user.id,
        },
      });

      importedCardsCount++;
    }

    // Buscar board completo para retornar
    const fullBoard = await prisma.board.findUnique({
      where: { id: board.id },
      include: {
        columns: {
          include: {
            cards: {
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
              orderBy: { order: "asc" },
            },
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      board: fullBoard,
      stats: {
        columnsImported: activeLists.length,
        cardsImported: importedCardsCount,
        cardsSkipped: skippedCardsCount,
      },
    });
  } catch (error) {
    console.error("Erro ao importar board do Trello:", error);
    return NextResponse.json(
      { error: "Erro ao importar board do Trello" },
      { status: 500 }
    );
  }
}
