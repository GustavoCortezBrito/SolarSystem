import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o banco
    await prisma.$connect();
    
    // Contar usuários
    const userCount = await prisma.user.count();
    
    // Contar empresas
    const companyCount = await prisma.company.count();
    
    return NextResponse.json({
      status: "OK",
      database: "Connected",
      users: userCount,
      companies: companyCount,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "ERROR",
      error: error.message,
      stack: error.stack,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    }, { status: 500 });
  }
}
