import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/board - Buscar board da empresa
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

    let board = await prisma.board.findUnique({
      where: { companyId },
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
                    status: true,
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
                order: "asc",
              },
            },
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Se não existir, criar board padrão
    if (!board) {
      board = await prisma.board.create({
        data: {
          companyId,
          name: "Board Principal",
          columns: {
            create: [
              {
                title: "Leads",
                color: "#3b82f6",
                order: 0,
                createdBy: session.user.id,
              },
              {
                title: "Dimensionamento",
                color: "#8b5cf6",
                order: 1,
                createdBy: session.user.id,
              },
              {
                title: "Proposta",
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
                title: "Instalação",
                color: "#06b6d4",
                order: 4,
                createdBy: session.user.id,
              },
              {
                title: "Concluído",
                color: "#22c55e",
                order: 5,
                createdBy: session.user.id,
              },
            ],
          },
        },
        include: {
          columns: {
            include: {
              cards: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error("Erro ao buscar board:", error);
    return NextResponse.json(
      { error: "Erro ao buscar board" },
      { status: 500 }
    );
  }
}
