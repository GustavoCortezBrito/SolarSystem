import "dotenv/config";
import bcrypt from "bcryptjs";
import { Client } from "pg";

async function createAdmin() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log("🔐 Criando usuário admin...");
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Verificar se já existe
    const checkResult = await client.query(
      'SELECT id FROM "users" WHERE email = $1',
      ['admin@solarsystem.com']
    );
    
    if (checkResult.rows.length > 0) {
      console.log("✅ Usuário admin já existe!");
      console.log("   Email: admin@solarsystem.com");
      console.log("   Senha: admin123");
      await client.end();
      return;
    }
    
    // Criar usuário
    const result = await client.query(
      `INSERT INTO "users" (id, email, name, password, role, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email, name`,
      ['admin@solarsystem.com', 'Admin Solar', hashedPassword, 'ADMIN']
    );
    
    console.log("✅ Usuário admin criado com sucesso!");
    console.log("   ID:", result.rows[0].id);
    console.log("   Email: admin@solarsystem.com");
    console.log("   Senha: admin123");
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await client.end();
  }
}

createAdmin();
