import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/equipment/inverters - Listar inversores
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const inverters = await prisma.inverter.findMany({
      orderBy: [
        { manufacturer: "asc" },
        { power: "desc" },
      ],
    });

    return NextResponse.json(inverters);
  } catch (error) {
    console.error("Erro ao buscar inversores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar inversores" },
      { status: 500 }
    );
  }
}

// POST /api/equipment/inverters - Criar inversor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { manufacturer, model, power, efficiency, warranty, price, phases } = body;

    if (!manufacturer || !model || !power || !efficiency || !warranty || !price) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const inverter = await prisma.inverter.create({
      data: {
        manufacturer,
        model,
        power,
        efficiency,
        warranty,
        price,
        phases: phases || 1,
      },
    });

    return NextResponse.json(inverter, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar inversor:", error);
    return NextResponse.json(
      { error: "Erro ao criar inversor" },
      { status: 500 }
    );
  }
}
