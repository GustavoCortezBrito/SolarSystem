/**
 * Prisma Client Singleton
 * 
 * Evita múltiplas instâncias do Prisma Client em desenvolvimento (hot reload).
 * Em produção, cria uma única instância.
 * 
 * Prisma 7: Requer adapter para Supabase/Neon
 */

import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Criar Pool e adapter Neon
const connectionString = process.env.DATABASE_URL!;
const pool = globalForPrisma.pool ?? new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
