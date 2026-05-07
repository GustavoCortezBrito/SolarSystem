import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, companyName } = body;

    // Validação
    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário, empresa, membership e board em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar usuário
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });

      // 2. Criar empresa
      const company = await tx.company.create({
        data: {
          name: companyName,
        },
      });

      // 3. Criar membership (usuário como OWNER da empresa)
      await tx.companyMember.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: "OWNER",
        },
      });

      // 4. Criar board padrão para a empresa
      await tx.board.create({
        data: {
          companyId: company.id,
          name: "Board Principal",
          columns: {
            create: [
              {
                title: "Novo Lead",
                color: "#3b82f6",
                order: 0,
                createdBy: user.id,
              },
              {
                title: "Qualificado",
                color: "#8b5cf6",
                order: 1,
                createdBy: user.id,
              },
              {
                title: "Proposta Enviada",
                color: "#f59e0b",
                order: 2,
                createdBy: user.id,
              },
              {
                title: "Negociação",
                color: "#10b981",
                order: 3,
                createdBy: user.id,
              },
              {
                title: "Ganho",
                color: "#22c55e",
                order: 4,
                createdBy: user.id,
              },
            ],
          },
        },
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        company: {
          id: company.id,
          name: company.name,
        },
      };
    });

    return NextResponse.json(
      {
        message: "Conta criada com sucesso",
        ...result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
