import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/equipment/optimizers - Listar otimizadores
export async function GET(request: NextRequest) {
  try {
    const optimizers = await prisma.optimizer.findMany({
      orderBy: [
        { manufacturer: "asc" },
        { model: "asc" },
      ],
    });

    return NextResponse.json(optimizers);
  } catch (error) {
    console.error("Erro ao buscar otimizadores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar otimizadores" },
      { status: 500 }
    );
  }
}

// POST /api/equipment/optimizers - Criar otimizador (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { manufacturer, model, power, efficiency, warranty, price } = body;

    if (!manufacturer || !model || !power || !efficiency || !warranty || !price) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const optimizer = await prisma.optimizer.create({
      data: {
        manufacturer,
        model,
        power: parseInt(power),
        efficiency: parseFloat(efficiency),
        warranty: parseInt(warranty),
        price: parseFloat(price),
      },
    });

    return NextResponse.json(optimizer, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar otimizador:", error);
    return NextResponse.json(
      { error: "Erro ao criar otimizador" },
      { status: 500 }
    );
  }
}
