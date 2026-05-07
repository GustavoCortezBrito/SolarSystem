import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/clients/[id] - Buscar cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        proposals: {
          orderBy: {
            createdAt: "desc",
          },
        },
        activities: {
          orderBy: {
            createdAt: "desc",
          },
          take: 50,
        },
        _count: {
          select: {
            proposals: true,
            activities: true,
            cards: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cliente" },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Atualizar cliente
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
    const {
      name,
      email,
      phone,
      cpfCnpj,
      address,
      city,
      state,
      zipCode,
      status,
      source,
      tags,
      notes,
      proposalValue,
      closedValue,
    } = body;

    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        cpfCnpj,
        address,
        city,
        state,
        zipCode,
        status,
        source,
        tags,
        notes,
        proposalValue,
        closedValue,
        lastContactAt: new Date(),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
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

    // Criar atividade de atualização
    await prisma.clientActivity.create({
      data: {
        clientId: client.id,
        userId: session.user.id,
        userName: session.user.name || "Sistema",
        type: "NOTE",
        description: "Dados do cliente atualizados",
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Deletar cliente
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
    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao deletar cliente" },
      { status: 500 }
    );
  }
}
