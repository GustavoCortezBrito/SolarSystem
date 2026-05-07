import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/equipment/batteries - Listar baterias
export async function GET(request: NextRequest) {
  try {
    const batteries = await prisma.battery.findMany({
      orderBy: [
        { manufacturer: "asc" },
        { model: "asc" },
      ],
    });

    return NextResponse.json(batteries);
  } catch (error) {
    console.error("Erro ao buscar baterias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar baterias" },
      { status: 500 }
    );
  }
}

// POST /api/equipment/batteries - Criar bateria (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { manufacturer, model, capacity, voltage, warranty, price } = body;

    if (!manufacturer || !model || !capacity || !voltage || !warranty || !price) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const battery = await prisma.battery.create({
      data: {
        manufacturer,
        model,
        capacity: parseFloat(capacity),
        voltage: parseInt(voltage),
        warranty: parseInt(warranty),
        price: parseFloat(price),
      },
    });

    return NextResponse.json(battery, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar bateria:", error);
    return NextResponse.json(
      { error: "Erro ao criar bateria" },
      { status: 500 }
    );
  }
}
