// Tipos para o catálogo de inversores

export type InverterSystem = "ON_GRID" | "OFF_GRID" | "HIBRIDO";
export type InverterType = "TRADICIONAL" | "MICROINVERSOR" | "OTIMIZADOR";

export interface Inverter {
  id: string;
  manufacturer: string; // Fabricante
  model: string; // Modelo
  
  // Sistema
  system: InverterSystem; // On grid, Off grid, Híbrido
  type: InverterType; // Tradicional, Microinversor, Otimizador
  
  // Potências
  nominalPower: number; // Potência nominal (W)
  maxPower: number; // Potência máxima (W)
  
  // Especificações elétricas de entrada (DC)
  maxDcVoltage: number; // Tensão máxima DC (V)
  startVoltage: number; // Tensão de partida (V)
  mpptVoltageRange: string; // Faixa de tensão MPPT (ex: "200-800V")
  maxDcCurrent: number; // Corrente máxima DC (A)
  mpptTrackers: number; // Número de MPPTs
  stringsPerMppt: number; // Strings por MPPT
  
  // Especificações elétricas de saída (AC)
  nominalAcVoltage: number; // Tensão nominal AC (V)
  acVoltageRange: string; // Faixa de tensão AC (ex: "180-240V")
  nominalAcCurrent: number; // Corrente nominal AC (A)
  maxAcCurrent: number; // Corrente máxima AC (A)
  frequency: string; // Frequência (ex: "50/60Hz")
  phases: number; // Número de fases (1 ou 3)
  
  // Eficiência
  maxEfficiency: number; // Eficiência máxima (%)
  europeanEfficiency?: number; // Eficiência europeia (%)
  
  // Proteções
  protections: string[]; // Ex: ["Sobretensão", "Sobrecorrente", "Anti-ilhamento"]
  
  // Dimensões e peso
  length: number; // Comprimento (mm)
  width: number; // Largura (mm)
  depth: number; // Profundidade (mm)
  weight: number; // Peso (kg)
  
  // Condições ambientais
  operatingTempRange: string; // Faixa de temperatura (ex: "-25°C a 60°C")
  ipRating: string; // Grau de proteção (ex: "IP65")
  
  // Informações comerciais
  price?: number; // Preço (R$)
  warranty: number; // Garantia (anos)
  availability: "DISPONIVEL" | "SOB_ENCOMENDA" | "INDISPONIVEL";
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}

export interface InverterFilter {
  search?: string;
  manufacturer?: string;
  system?: InverterSystem;
  type?: InverterType;
  minPower?: number;
  maxPower?: number;
  phases?: number;
  availability?: "DISPONIVEL" | "SOB_ENCOMENDA" | "INDISPONIVEL";
}
