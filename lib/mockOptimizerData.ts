import type { Optimizer } from "@/types/optimizer";

const manufacturers = [
  "HUAWEI",
  "SOLAREDGE",
  "TIGO",
  "ENPHASE",
  "APsystems",
  "HOYMILES",
  "GROWATT",
  "SUNGROW",
  "FRONIUS",
  "SMA",
];

// Gerar otimizadores mock
export const generateMockOptimizers = (count: number = 200): Optimizer[] => {
  const optimizers: Optimizer[] = [];
  
  for (let i = 0; i < count; i++) {
    const manufacturer = manufacturers[i % manufacturers.length];
    const power = 300 + (i % 40) * 50; // 300W a 2250W
    const modulesPerOptimizer = i % 4 === 0 ? 1 : i % 4 === 1 ? 2 : i % 4 === 2 ? 4 : 1;
    
    optimizers.push({
      id: `optimizer-${i + 1}`,
      manufacturer,
      model: `${manufacturer.split(" ")[0]}${power}W-${modulesPerOptimizer > 1 ? `${modulesPerOptimizer}M` : "P"}`,
      
      power,
      
      // Entrada
      maxInputVoltage: 60 + (i % 20) * 5, // 60V a 155V
      maxInputCurrent: Math.round(power / 40), // Calculado
      mpptVoltageRange: "12-48V",
      
      // Saída
      maxOutputVoltage: 80,
      maxOutputCurrent: Math.round(power / 40 * 1.2),
      maxShortCircuitCurrent: Math.round(power / 40 * 1.5),
      
      // Configuração
      modulesPerOptimizer,
      maxStringLength: modulesPerOptimizer === 1 ? 25 : modulesPerOptimizer === 2 ? 15 : 10,
      
      // Eficiência
      maxEfficiency: 98.5 + (i % 15) * 0.1,
      weightedEfficiency: 97.5 + (i % 15) * 0.1,
      
      // Comunicação
      communication: modulesPerOptimizer === 1 
        ? ["PLC", "Wireless"] 
        : ["PLC", "RS485"],
      monitoring: true,
      
      // Proteções
      protections: [
        "Sobretensão de entrada",
        "Sobrecorrente de entrada",
        "Sobretensão de saída",
        "Proteção de temperatura",
        "Proteção de isolamento",
        "Anti-ilhamento",
      ],
      
      // Dimensões
      length: modulesPerOptimizer === 1 ? 180 : 250,
      width: modulesPerOptimizer === 1 ? 140 : 180,
      depth: modulesPerOptimizer === 1 ? 35 : 45,
      weight: modulesPerOptimizer === 1 ? 0.8 : 1.5,
      
      // Condições
      operatingTempRange: "-40°C a 85°C",
      ipRating: "IP68",
      
      // Compatibilidade
      compatibleInverters: ["Growatt", "Deye", "Goodwe", "Sofar", "Fronius"],
      compatibleModules: ["Todos os módulos de 60-72 células"],
      
      // Comercial
      price: power * 0.5 + (i % 100),
      warranty: 25,
      availability: i % 10 === 0 ? "SOB_ENCOMENDA" : i % 20 === 0 ? "INDISPONIVEL" : "DISPONIVEL",
      
      createdAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
      updatedAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
    });
  }
  
  return optimizers;
};

let cachedOptimizers: Optimizer[] | null = null;

export const getAllOptimizers = (): Optimizer[] => {
  if (!cachedOptimizers) {
    cachedOptimizers = generateMockOptimizers(200);
  }
  return cachedOptimizers;
};

export const getOptimizerById = (id: string): Optimizer | undefined => {
  return getAllOptimizers().find((opt) => opt.id === id);
};

export const getOptimizerManufacturers = (): string[] => {
  return manufacturers;
};

export const filterOptimizers = (
  filters: {
    search?: string;
    manufacturer?: string;
    minPower?: number;
    maxPower?: number;
    modulesPerOptimizer?: number;
    availability?: string;
  },
  page: number = 1,
  pageSize: number = 20
) => {
  let filtered = getAllOptimizers();
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (opt) =>
        opt.manufacturer.toLowerCase().includes(search) ||
        opt.model.toLowerCase().includes(search)
    );
  }
  
  if (filters.manufacturer) {
    filtered = filtered.filter((opt) => opt.manufacturer === filters.manufacturer);
  }
  
  if (filters.minPower) {
    filtered = filtered.filter((opt) => opt.power >= filters.minPower!);
  }
  
  if (filters.maxPower) {
    filtered = filtered.filter((opt) => opt.power <= filters.maxPower!);
  }
  
  if (filters.modulesPerOptimizer) {
    filtered = filtered.filter((opt) => opt.modulesPerOptimizer === filters.modulesPerOptimizer);
  }
  
  if (filters.availability) {
    filtered = filtered.filter((opt) => opt.availability === filters.availability);
  }
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const optimizers = filtered.slice(start, end);
  
  return {
    optimizers,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};
