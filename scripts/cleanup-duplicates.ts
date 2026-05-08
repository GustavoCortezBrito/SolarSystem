import "dotenv/config";
import { Client } from "pg";

async function cleanupDuplicates() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log("🧹 Limpando empresas duplicadas...\n");
    
    // Listar todas as empresas
    const companiesResult = await client.query(
      'SELECT id, name, "createdAt" FROM companies ORDER BY "createdAt" ASC'
    );
    
    console.log("📋 Empresas encontradas:");
    companiesResult.rows.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (ID: ${company.id.substring(0, 8)}...) - Criada em: ${new Date(company.createdAt).toLocaleString()}`);
    });
    
    // Agrupar por nome
    const companiesByName: { [key: string]: any[] } = {};
    companiesResult.rows.forEach(company => {
      if (!companiesByName[company.name]) {
        companiesByName[company.name] = [];
      }
      companiesByName[company.name].push(company);
    });
    
    // Encontrar duplicatas
    const duplicates = Object.entries(companiesByName).filter(([_, companies]) => companies.length > 1);
    
    if (duplicates.length === 0) {
      console.log("\n✅ Nenhuma duplicata encontrada!");
      await client.end();
      return;
    }
    
    console.log(`\n⚠️  Encontradas ${duplicates.length} empresas com duplicatas:\n`);
    
    for (const [name, companies] of duplicates) {
      console.log(`📦 "${name}" - ${companies.length} cópias`);
      
      // Manter a primeira (mais antiga) e deletar as outras
      const [keep, ...toDelete] = companies;
      
      console.log(`   ✅ Mantendo: ${keep.id.substring(0, 8)}... (${new Date(keep.createdAt).toLocaleString()})`);
      
      for (const company of toDelete) {
        console.log(`   ❌ Deletando: ${company.id.substring(0, 8)}... (${new Date(company.createdAt).toLocaleString()})`);
        
        // Deletar boards da empresa
        await client.query('DELETE FROM boards WHERE "companyId" = $1', [company.id]);
        
        // Deletar memberships
        await client.query('DELETE FROM company_members WHERE "companyId" = $1', [company.id]);
        
        // Deletar a empresa
        await client.query('DELETE FROM companies WHERE id = $1', [company.id]);
      }
      
      console.log(`   ✅ ${toDelete.length} duplicata(s) removida(s)\n`);
    }
    
    console.log("✅ Limpeza concluída!");
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await client.end();
  }
}

cleanupDuplicates();
