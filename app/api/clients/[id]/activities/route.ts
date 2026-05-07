import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/clients/[id]/activities - Adicionar atividade/nota manual
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: clientId } = await params;
    const body = await request.json();
    const { type, description, metadata } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Descrição é obrigatória" },
        { status: 400 }
      );
    }

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Criar atividade
    const activity = await prisma.clientActivity.create({
      data: {
        clientId,
        userId: session.user.id,
        userName: session.user.name || "Usuário",
        type: type || "NOTE",
        description,
        metadata: metadata || {},
      },
    });

    // Atualizar lastContactAt do cliente
    await prisma.client.update({
      where: { id: clientId },
      data: { lastContactAt: new Date() },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    return NextResponse.json(
      { error: "Erro ao criar atividade" },
      { status: 500 }
    );
  }
}
