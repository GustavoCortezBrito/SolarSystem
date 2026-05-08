import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/calculations - Buscar cálculos da empresa
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const clientId = searchParams.get("clientId");

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId é obrigatório" },
        { status: 400 }
      );
    }

    const where: any = { companyId };
    if (clientId) where.clientId = clientId;

    const calculations = await prisma.calculation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
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
        createdAt: "desc",
      },
    });

    return NextResponse.json(calculations);
  } catch (error) {
    console.error("Erro ao buscar cálculos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cálculos" },
      { status: 500 }
    );
  }
}

// POST /api/calculations - Criar cálculo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      companyId,
      clientId,
      propertyType,
      monthlyConsumption,
      monthlyBill,
      tariff,
      solarIrradiation,
      roofType,
      panelPowerWp,
      systemType,
      hasBattery,
      result,
    } = body;

    if (!companyId || !propertyType || !monthlyConsumption || !result) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const calculation = await prisma.calculation.create({
      data: {
        companyId,
        clientId,
        createdBy: session.user.id,
        propertyType,
        monthlyConsumption: parseFloat(monthlyConsumption),
        monthlyBill: parseFloat(monthlyBill),
        tariff: parseFloat(tariff),
        solarIrradiation: parseFloat(solarIrradiation),
        roofType,
        panelPowerWp: parseInt(panelPowerWp),
        systemType,
        hasBattery,
        // Resultado
        systemPowerKWp: result.systemPowerKWp,
        numberOfPanels: result.numberOfPanels,
        inverterPowerKW: result.inverterPowerKW,
        monthlyGeneration: result.monthlyGeneration,
        annualGeneration: result.annualGeneration,
        systemCost: result.systemCost,
        monthlySavings: result.monthlySavings,
        annualSavings: result.annualSavings,
        paybackYears: result.paybackYears,
        roi25Years: result.roi25Years,
        requiredAreaM2: result.requiredAreaM2,
        co2AvoidedKgYear: result.co2AvoidedKgYear,
        treesEquivalent: result.treesEquivalent,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
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

    // Se vinculou cliente, criar atividade
    if (clientId) {
      await prisma.clientActivity.create({
        data: {
          clientId,
          userId: session.user.id,
          userName: session.user.name || "Sistema",
          type: "CALCULATION",
          description: `Cálculo solar realizado: ${result.systemPowerKWp.toFixed(2)} kWp com ${result.numberOfPanels} painéis`,
          metadata: { calculationId: calculation.id },
        },
      });
    }

    return NextResponse.json(calculation, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cálculo:", error);
    
    // Log detalhado do erro
    if (error instanceof Error) {
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
    }
    
    return NextResponse.json(
      { 
        error: "Erro ao criar cálculo",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
