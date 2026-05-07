import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/clients - Listar clientes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const status = searchParams.get("status");

    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;

    const clients = await prisma.client.findMany({
      where,
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
        _count: {
          select: {
            proposals: true,
            activities: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}

// POST /api/clients - Criar cliente
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      companyId,
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
    } = body;

    // Validação
    if (!companyId || !name || !phone) {
      return NextResponse.json(
        { error: "Campos obrigatórios: companyId, name, phone" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        companyId,
        name,
        email,
        phone,
        cpfCnpj,
        address,
        city,
        state,
        zipCode,
        status: status || "LEAD",
        source,
        tags: tags || [],
        notes,
        createdBy: session.user.id,
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

    // Criar atividade inicial
    await prisma.clientActivity.create({
      data: {
        clientId: client.id,
        userId: session.user.id,
        userName: session.user.name || "Sistema",
        type: "NOTE",
        description: "Cliente cadastrado no sistema",
        metadata: { source: source || "manual" },
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}
