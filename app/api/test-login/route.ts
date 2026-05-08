import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("🔍 Testando login para:", email);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "Usuário não encontrado",
        email,
      });
    }

    console.log("✅ Usuário encontrado:", {
      id: user.id,
      email: user.email,
      hasPassword: !!user.password,
    });

    if (!user.password) {
      return NextResponse.json({
        success: false,
        error: "Usuário não tem senha configurada",
        user: {
          id: user.id,
          email: user.email,
        },
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("🔐 Senha válida?", isPasswordValid);

    return NextResponse.json({
      success: isPasswordValid,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      passwordMatch: isPasswordValid,
    });
  } catch (error: any) {
    console.error("❌ Erro no teste de login:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
