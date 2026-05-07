// Tipos para o catálogo de módulos fotovoltaicos

export type CellType = "MONOCRISTALINO" | "POLICRISTALINO" | "FILME_FINO";

export interface SolarModule {
  id: string;
  manufacturer: string; // Fabricante
  model: string; // Modelo
  power: number; // Potência (W)
  cells: number; // Número de células
  efficiency: number; // Eficiência (%)
  cellType: CellType; // Tipo de célula
  
  // Dimensões
  length: number; // Comprimento (mm)
  width: number; // Largura (mm)
  depth: number; // Profundidade (mm)
  weight: number; // Peso (kg)
  
  // Especificações elétricas
  voltage: number; // Tensão (V)
  vmp: number; // Tensão de operação Vmp (V)
  imp: number; // Corrente de operação Imp (A)
  voc: number; // Tensão de circuito aberto Voc (V)
  isc: number; // Corrente de curto circuito Isc (A)
  
  // Coeficientes de temperatura
  tempCoefficientPmax: number; // %/°C
  tempCoefficientVoc: number; // %/°C
  tempCoefficientIsc: number; // %/°C
  
  // Informações comerciais
  price?: number; // Preço (R$)
  warranty: number; // Garantia (anos)
  availability: "DISPONIVEL" | "SOB_ENCOMENDA" | "INDISPONIVEL";
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}

export interface ModuleFilter {
  search?: string; // Busca por fabricante ou modelo
  manufacturer?: string;
  cellType?: CellType;
  minPower?: number;
  maxPower?: number;
  minEfficiency?: number;
  availability?: "DISPONIVEL" | "SOB_ENCOMENDA" | "INDISPONIVEL";
}

export interface ModulePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ModuleListResponse {
  modules: SolarModule[];
  pagination: ModulePagination;
}
