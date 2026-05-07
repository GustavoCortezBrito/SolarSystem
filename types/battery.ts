// Tipos para o catálogo de baterias

export type BatteryType = "LITIO" | "CHUMBO_ACIDO" | "GEL" | "AGM";
export type BatteryVoltage = 12 | 24 | 48 | 51.2 | 192 | 384;

export interface Battery {
  id: string;
  manufacturer: string; // Fabricante
  model: string; // Modelo
  
  // Tipo
  type: BatteryType; // Lítio, Chumbo-ácido, Gel, AGM
  
  // Especificações elétricas
  voltage: number; // Tensão (V)
  capacity: number; // Capacidade (kWh)
  usableCapacity?: number; // Capacidade útil (kWh)
  
  // Correntes
  maxDischargeCurrent: number; // Corrente máxima de descarga (A)
  maxChargeCurrent: number; // Corrente máxima de carga (A)
  continuousDischargeCurrent?: number; // Corrente contínua de descarga (A)
  continuousChargeCurrent?: number; // Corrente contínua de carga (A)
  
  // Ciclos e vida útil
  cycleLife: number; // Ciclos de vida (ex: 6000)
  dod: number; // Profundidade de descarga (%) - Depth of Discharge
  warranty: number; // Garantia (anos)
  
  // Dimensões e peso
  length: number; // Comprimento (mm)
  width: number; // Largura (mm)
  depth: number; // Profundidade (mm)
  weight: number; // Peso (kg)
  
  // Condições ambientais
  operatingTempRange: string; // Faixa de temperatura (ex: "-10°C a 50°C")
  ipRating: string; // Grau de proteção (ex: "IP65")
  
  // Características especiais
  features: string[]; // Ex: ["BMS integrado", "Expansível", "Comunicação CAN"]
  
  // Compatibilidade
  compatibleInverters?: string[]; // Inversores compatíveis
  
  // Informações comerciais
  price?: number; // Preço (R$)
  availability: "DISPONIVEL" | "SOB_ENCOMENDA" | "INDISPONIVEL";
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}

export interface BatteryFilter {
  search?: string;
  manufacturer?: string;
  type?: BatteryType;
  voltage?: number;
  minCapacity?: number;
  maxCapacity?: number;
  availability?: "DISPONIVEL" | "SOB_ENCOMENDA" | "INDISPONIVEL";
}
