import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/equipment/modules - Listar módulos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const modules = await prisma.module.findMany({
      orderBy: [
        { manufacturer: "asc" },
        { power: "desc" },
      ],
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar módulos" },
      { status: 500 }
    );
  }
}

// POST /api/equipment/modules - Criar módulo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { manufacturer, model, power, efficiency, warranty, price } = body;

    if (!manufacturer || !model || !power || !efficiency || !warranty || !price) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const module = await prisma.module.create({
      data: {
        manufacturer,
        model,
        power,
        efficiency,
        warranty,
        price,
      },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    return NextResponse.json(
      { error: "Erro ao criar módulo" },
      { status: 500 }
    );
  }
}
