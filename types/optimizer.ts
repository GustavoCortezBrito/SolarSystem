// Tipos para o catálogo de otimizadores

export interface Optimizer {
  id: string;
  manufacturer: string; // Fabricante
  model: string; // Modelo
  
  // Especificações de potência
  power: number; // Potência (W)
  
  // Especificações elétricas de entrada
  maxInputVoltage: number; // Máxima tensão de entrada (V)
  maxInputCurrent: number; // Máxima corrente de entrada (A)
  mpptVoltageRange: string; // Faixa de tensão MPPT (ex: "12-48V")
  
  // Especificações elétricas de saída
  maxOutputVoltage: number; // Máxima tensão de saída (V)
  maxOutputCurrent: number; // Máxima corrente de saída (A)
  maxShortCircuitCurrent: number; // Máxima corrente de curto circuito (A)
  
  // Configuração
  modulesPerOptimizer: number; // Módulos por otimizador
  maxStringLength: number; // Comprimento máximo da string
  
  // Eficiência
  maxEfficiency: number; // Eficiência máxima (%)
  weightedEfficiency?: number; // Eficiência ponderada (%)
  
  // Comunicação e monitoramento
  communication: string[]; // Ex: ["PLC", "Wireless", "RS485"]
  monitoring: boolean; // Monitoramento por módulo
  
  // Proteções
  protections: string[]; // Ex: ["Sobretensão", "Sobrecorrente", "Anti-ilhamento"]
  
  // Dimensões e peso
  length: number; // Comprimento (mm)
  width: number; // Largura (mm)
  depth: number; // Profundidade (mm)
  weight: number; // Peso (kg)
  
  // Condições ambientais
  operatingTempRange: string; // Faixa de temperatura (ex: "-40°C a 85°C")
  ipRating: string; // Grau de proteção (ex: "IP68")
  
  // Compatibilidade
  compatibleInverters?: string[]; // Inversores compatíveis
  compatibleModules?: string[]; // Módulos compatíveis
  
  // Informações comerciais
  price?: number; // Preço (R$)
  warranty: number; // Garantia (anos)
  availability: "DISPONIVEL" | "SOB_ENCOMENDA" | "INDISPONIVEL";
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}

export interface OptimizerFilter {
  search?: string;
  manufacturer?: string;
  minPower?: number;
  maxPower?: number;
  modulesPerOptimizer?: number;
  availability?: "DISPONIVEL" | "SOB_ENCOMENDA" | "INDISPONIVEL";
}
