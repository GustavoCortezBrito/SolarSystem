import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PUT /api/board/columns/[id] - Atualizar coluna
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, color, order } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (color !== undefined) updateData.color = color;
    if (order !== undefined) updateData.order = order;

    const column = await prisma.column.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
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
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(column);
  } catch (error) {
    console.error("Erro ao atualizar coluna:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar coluna" },
      { status: 500 }
    );
  }
}

// DELETE /api/board/columns/[id] - Deletar coluna
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se a coluna tem cards
    const column = await prisma.column.findUnique({
      where: { id },
      include: {
        _count: {
          select: { cards: true },
        },
      },
    });

    if (!column) {
      return NextResponse.json(
        { error: "Coluna não encontrada" },
        { status: 404 }
      );
    }

    if (column._count.cards > 0) {
      return NextResponse.json(
        { error: "Não é possível deletar coluna com cards. Mova os cards primeiro." },
        { status: 400 }
      );
    }

    await prisma.column.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Coluna deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar coluna:", error);
    return NextResponse.json(
      { error: "Erro ao deletar coluna" },
      { status: 500 }
    );
  }
}
