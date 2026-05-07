import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/board/columns - Criar coluna
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { boardId, title, color, order } = body;

    if (!boardId || !title) {
      return NextResponse.json(
        { error: "boardId e title são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se board existe
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          orderBy: { order: "desc" },
          take: 1,
        },
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board não encontrado" },
        { status: 404 }
      );
    }

    // Se order não foi fornecido, colocar no final
    const columnOrder = order !== undefined 
      ? order 
      : (board.columns[0]?.order ?? -1) + 1;

    const column = await prisma.column.create({
      data: {
        boardId,
        title,
        color: color || "#3b82f6",
        order: columnOrder,
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        cards: true,
      },
    });

    return NextResponse.json(column, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar coluna:", error);
    return NextResponse.json(
      { error: "Erro ao criar coluna" },
      { status: 500 }
    );
  }
}

// PUT /api/board/columns - Reordenar colunas
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { columns } = body; // Array de { id, order }

    if (!columns || !Array.isArray(columns)) {
      return NextResponse.json(
        { error: "columns deve ser um array" },
        { status: 400 }
      );
    }

    // Atualizar ordem de todas as colunas em uma transação
    await prisma.$transaction(
      columns.map((col: { id: string; order: number }) =>
        prisma.column.update({
          where: { id: col.id },
          data: { order: col.order },
        })
      )
    );

    return NextResponse.json({ message: "Colunas reordenadas com sucesso" });
  } catch (error) {
    console.error("Erro ao reordenar colunas:", error);
    return NextResponse.json(
      { error: "Erro ao reordenar colunas" },
      { status: 500 }
    );
  }
}
