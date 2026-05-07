import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Prisma 7 usa prisma.config.ts para configuração
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✓ Configurada" : "✗ Não configurada");

  try {
    // Testar conexão
    await prisma.$connect();
    console.log("✓ Conectado ao banco de dados");
  } catch (error) {
    console.error("✗ Erro ao conectar:", error);
    throw error;
  }

  // Criar usuário admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@solarsystem.com" },
    update: {},
    create: {
      email: "admin@solarsystem.com",
      name: "Admin Solar",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Usuário admin criado:", admin.email);

  // Criar empresa exemplo
  const company = await prisma.company.upsert({
    where: { cnpj: "12.345.678/0001-90" },
    update: {},
    create: {
      name: "Solar Energy LTDA",
      cnpj: "12.345.678/0001-90",
      email: "contato@solarenergy.com",
      phone: "(11) 98765-4321",
      address: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    },
  });
  console.log("✅ Empresa criada:", company.name);

  // Vincular admin à empresa
  await prisma.companyMember.upsert({
    where: {
      companyId_userId: {
        companyId: company.id,
        userId: admin.id,
      },
    },
    update: {},
    create: {
      companyId: company.id,
      userId: admin.id,
      role: "OWNER",
    },
  });
  console.log("✅ Admin vinculado à empresa");

  // Criar módulos solares
  const modules = [
    {
      manufacturer: "Canadian Solar",
      model: "CS3W-450P",
      power: 450,
      efficiency: 20.5,
      warranty: 25,
      price: 650,
    },
    {
      manufacturer: "Jinko Solar",
      model: "Tiger Pro 550W",
      power: 550,
      efficiency: 21.2,
      warranty: 25,
      price: 780,
    },
    {
      manufacturer: "Trina Solar",
      model: "Vertex S 405W",
      power: 405,
      efficiency: 20.8,
      warranty: 25,
      price: 620,
    },
    {
      manufacturer: "JA Solar",
      model: "JAM72S30 540W",
      power: 540,
      efficiency: 21.0,
      warranty: 25,
      price: 750,
    },
  ];

  for (const module of modules) {
    await prisma.module.upsert({
      where: {
        manufacturer_model: {
          manufacturer: module.manufacturer,
          model: module.model,
        },
      },
      update: {},
      create: module,
    });
  }
  console.log(`✅ ${modules.length} módulos solares criados`);

  // Criar inversores
  const inverters = [
    {
      manufacturer: "Growatt",
      model: "MIN 3000TL-X",
      power: 3000,
      efficiency: 97.6,
      warranty: 10,
      price: 2500,
      phases: 1,
    },
    {
      manufacturer: "Fronius",
      model: "Primo 5.0-1",
      power: 5000,
      efficiency: 98.0,
      warranty: 10,
      price: 4200,
      phases: 1,
    },
    {
      manufacturer: "Solis",
      model: "S5-GR1P6K",
      power: 6000,
      efficiency: 97.8,
      warranty: 10,
      price: 3800,
      phases: 1,
    },
    {
      manufacturer: "Huawei",
      model: "SUN2000-10KTL-M1",
      power: 10000,
      efficiency: 98.6,
      warranty: 10,
      price: 6500,
      phases: 3,
    },
  ];

  for (const inverter of inverters) {
    await prisma.inverter.upsert({
      where: {
        manufacturer_model: {
          manufacturer: inverter.manufacturer,
          model: inverter.model,
        },
      },
      update: {},
      create: inverter,
    });
  }
  console.log(`✅ ${inverters.length} inversores criados`);

  // Criar baterias
  const batteries = [
    {
      manufacturer: "BYD",
      model: "Battery-Box Premium HVS 7.7",
      capacity: 7.7,
      voltage: 51,
      warranty: 10,
      price: 18000,
    },
    {
      manufacturer: "Tesla",
      model: "Powerwall 2",
      capacity: 13.5,
      voltage: 48,
      warranty: 10,
      price: 35000,
    },
    {
      manufacturer: "LG Chem",
      model: "RESU 10H",
      capacity: 9.8,
      voltage: 48,
      warranty: 10,
      price: 22000,
    },
  ];

  for (const battery of batteries) {
    await prisma.battery.upsert({
      where: {
        manufacturer_model: {
          manufacturer: battery.manufacturer,
          model: battery.model,
        },
      },
      update: {},
      create: battery,
    });
  }
  console.log(`✅ ${batteries.length} baterias criadas`);

  // Criar otimizadores
  const optimizers = [
    {
      manufacturer: "SolarEdge",
      model: "P370",
      power: 370,
      efficiency: 99.5,
      warranty: 25,
      price: 280,
    },
    {
      manufacturer: "Tigo",
      model: "TS4-A-O",
      power: 700,
      efficiency: 99.5,
      warranty: 25,
      price: 320,
    },
  ];

  for (const optimizer of optimizers) {
    await prisma.optimizer.upsert({
      where: {
        manufacturer_model: {
          manufacturer: optimizer.manufacturer,
          model: optimizer.model,
        },
      },
      update: {},
      create: optimizer,
    });
  }
  console.log(`✅ ${optimizers.length} otimizadores criados`);

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📝 Credenciais de acesso:");
  console.log("   Email: admin@solarsystem.com");
  console.log("   Senha: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
