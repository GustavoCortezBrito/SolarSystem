import "dotenv/config";
import { Client } from "pg";

async function seedEquipment() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log("🌱 Populando equipamentos...\n");
    
    // Módulos solares
    const modules = [
      { manufacturer: "Canadian Solar", model: "CS3W-450P", power: 450, efficiency: 20.5, warranty: 25, price: 650 },
      { manufacturer: "Jinko Solar", model: "Tiger Pro 550W", power: 550, efficiency: 21.2, warranty: 25, price: 780 },
      { manufacturer: "Trina Solar", model: "Vertex S 405W", power: 405, efficiency: 20.8, warranty: 25, price: 620 },
      { manufacturer: "JA Solar", model: "JAM72S30 540W", power: 540, efficiency: 21.0, warranty: 25, price: 750 },
    ];
    
    for (const module of modules) {
      await client.query(
        `INSERT INTO modules (id, manufacturer, model, power, efficiency, warranty, price, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
        [module.manufacturer, module.model, module.power, module.efficiency, module.warranty, module.price]
      );
    }
    console.log(`✅ ${modules.length} módulos solares criados`);
    
    // Inversores
    const inverters = [
      { manufacturer: "Growatt", model: "MIN 3000TL-X", power: 3000, efficiency: 97.6, warranty: 10, price: 2500, phases: 1 },
      { manufacturer: "Fronius", model: "Primo 5.0-1", power: 5000, efficiency: 98.0, warranty: 10, price: 4200, phases: 1 },
      { manufacturer: "Solis", model: "S5-GR1P6K", power: 6000, efficiency: 97.8, warranty: 10, price: 3800, phases: 1 },
      { manufacturer: "Huawei", model: "SUN2000-10KTL-M1", power: 10000, efficiency: 98.6, warranty: 10, price: 6500, phases: 3 },
    ];
    
    for (const inverter of inverters) {
      await client.query(
        `INSERT INTO inverters (id, manufacturer, model, power, efficiency, warranty, price, phases, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
        [inverter.manufacturer, inverter.model, inverter.power, inverter.efficiency, inverter.warranty, inverter.price, inverter.phases]
      );
    }
    console.log(`✅ ${inverters.length} inversores criados`);
    
    // Baterias
    const batteries = [
      { manufacturer: "BYD", model: "Battery-Box Premium HVS 7.7", capacity: 7.7, voltage: 51, warranty: 10, price: 18000 },
      { manufacturer: "Tesla", model: "Powerwall 2", capacity: 13.5, voltage: 48, warranty: 10, price: 35000 },
      { manufacturer: "LG Chem", model: "RESU 10H", capacity: 9.8, voltage: 48, warranty: 10, price: 22000 },
    ];
    
    for (const battery of batteries) {
      await client.query(
        `INSERT INTO batteries (id, manufacturer, model, capacity, voltage, warranty, price, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
        [battery.manufacturer, battery.model, battery.capacity, battery.voltage, battery.warranty, battery.price]
      );
    }
    console.log(`✅ ${batteries.length} baterias criadas`);
    
    // Otimizadores
    const optimizers = [
      { manufacturer: "SolarEdge", model: "P370", power: 370, efficiency: 99.5, warranty: 25, price: 280 },
      { manufacturer: "Tigo", model: "TS4-A-O", power: 700, efficiency: 99.5, warranty: 25, price: 320 },
    ];
    
    for (const optimizer of optimizers) {
      await client.query(
        `INSERT INTO optimizers (id, manufacturer, model, power, efficiency, warranty, price, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
        [optimizer.manufacturer, optimizer.model, optimizer.power, optimizer.efficiency, optimizer.warranty, optimizer.price]
      );
    }
    console.log(`✅ ${optimizers.length} otimizadores criados`);
    
    console.log("\n✅ Equipamentos populados com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await client.end();
  }
}

seedEquipment();
