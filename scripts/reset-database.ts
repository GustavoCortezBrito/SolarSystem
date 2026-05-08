import "dotenv/config";
import { Client } from "pg";

async function resetDatabase() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log("🗑️  Resetando banco de dados...\n");
    
    // 1. Deletar notificações
    const notificationsResult = await client.query('DELETE FROM notifications RETURNING id');
    console.log(`✅ ${notificationsResult.rowCount} notificações removidas`);
    
    // 2. Deletar atividades de clientes
    const activitiesResult = await client.query('DELETE FROM client_activities RETURNING id');
    console.log(`✅ ${activitiesResult.rowCount} atividades de clientes removidas`);
    
    // 3. Deletar cards
    const cardsResult = await client.query('DELETE FROM cards RETURNING id');
    console.log(`✅ ${cardsResult.rowCount} cards removidos`);
    
    // 4. Deletar colunas do board
    const columnsResult = await client.query('DELETE FROM columns RETURNING id');
    console.log(`✅ ${columnsResult.rowCount} colunas removidas`);
    
    // 5. Deletar boards
    const boardsResult = await client.query('DELETE FROM boards RETURNING id');
    console.log(`✅ ${boardsResult.rowCount} boards removidos`);
    
    // 6. Deletar propostas
    const proposalsResult = await client.query('DELETE FROM proposals RETURNING id');
    console.log(`✅ ${proposalsResult.rowCount} propostas removidas`);
    
    // 7. Deletar clientes
    const clientsResult = await client.query('DELETE FROM clients RETURNING id');
    console.log(`✅ ${clientsResult.rowCount} clientes removidos`);
    
    // 8. Deletar membros de empresas
    const membersResult = await client.query('DELETE FROM company_members RETURNING id');
    console.log(`✅ ${membersResult.rowCount} membros de empresas removidos`);
    
    // 9. Deletar empresas
    const companiesResult = await client.query('DELETE FROM companies RETURNING id');
    console.log(`✅ ${companiesResult.rowCount} empresas removidas`);
    
    // 10. Deletar sessões do NextAuth
    const sessionsResult = await client.query('DELETE FROM sessions RETURNING id');
    console.log(`✅ ${sessionsResult.rowCount} sessões removidas`);
    
    // 11. Deletar accounts do NextAuth
    const accountsResult = await client.query('DELETE FROM accounts RETURNING id');
    console.log(`✅ ${accountsResult.rowCount} accounts removidas`);
    
    // 12. Deletar usuários (exceto admin)
    const usersResult = await client.query(
      'DELETE FROM users WHERE email != $1 RETURNING id',
      ['admin@solarsystem.com']
    );
    console.log(`✅ ${usersResult.rowCount} usuários removidos (mantido admin)`);
    
    console.log("\n📊 Dados mantidos:");
    
    // Verificar usuário admin
    const adminResult = await client.query(
      'SELECT id, email, name, role FROM users WHERE email = $1',
      ['admin@solarsystem.com']
    );
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      console.log(`   👤 Usuário: ${admin.name} (${admin.email}) - Role: ${admin.role}`);
    }
    
    // Contar equipamentos
    const modulesCount = await client.query('SELECT COUNT(*) FROM modules');
    const invertersCount = await client.query('SELECT COUNT(*) FROM inverters');
    const batteriesCount = await client.query('SELECT COUNT(*) FROM batteries');
    const optimizersCount = await client.query('SELECT COUNT(*) FROM optimizers');
    
    console.log(`   ⚡ Módulos: ${modulesCount.rows[0].count}`);
    console.log(`   🔌 Inversores: ${invertersCount.rows[0].count}`);
    console.log(`   🔋 Baterias: ${batteriesCount.rows[0].count}`);
    console.log(`   📡 Otimizadores: ${optimizersCount.rows[0].count}`);
    
    console.log("\n✅ Banco de dados resetado com sucesso!");
    console.log("\n🔐 Credenciais de acesso:");
    console.log("   Email: admin@solarsystem.com");
    console.log("   Senha: admin123");
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await client.end();
  }
}

resetDatabase();
