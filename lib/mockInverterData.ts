import type { Inverter } from "@/types/inverter";

const manufacturers = [
  "ABB",
  "FRONIUS",
  "GROWATT",
  "HUAWEI",
  "SMA",
  "SOLIS",
  "CANADIAN SOLAR",
  "DEYE",
  "GOODWE",
  "SOFAR",
];

// Gerar inversores mock
export const generateMockInverters = (count: number = 500): Inverter[] => {
  const inverters: Inverter[] = [];
  
  for (let i = 0; i < count; i++) {
    const manufacturer = manufacturers[i % manufacturers.length];
    const nominalPower = 3000 + (i % 100) * 1000; // 3kW a 102kW
    const maxPower = Math.round(nominalPower * 1.1);
    const system = i % 3 === 0 ? "ON_GRID" : i % 3 === 1 ? "HIBRIDO" : "OFF_GRID";
    const type = i % 4 === 0 ? "MICROINVERSOR" : i % 4 === 1 ? "OTIMIZADOR" : "TRADICIONAL";
    const phases = nominalPower < 10000 ? 1 : 3;
    
    inverters.push({
      id: `inverter-${i + 1}`,
      manufacturer,
      model: `${manufacturer.split(" ")[0]}-${Math.round(nominalPower / 1000)}K-TL`,
      
      system,
      type,
      
      nominalPower,
      maxPower,
      
      // Entrada DC
      maxDcVoltage: 1000,
      startVoltage: 150,
      mpptVoltageRange: "200-800V",
      maxDcCurrent: Math.round(nominalPower / 400),
      mpptTrackers: nominalPower < 10000 ? 2 : nominalPower < 30000 ? 3 : 6,
      stringsPerMppt: 2,
      
      // Saída AC
      nominalAcVoltage: phases === 1 ? 220 : 380,
      acVoltageRange: phases === 1 ? "180-240V" : "320-440V",
      nominalAcCurrent: Math.round(nominalPower / (phases === 1 ? 220 : 380)),
      maxAcCurrent: Math.round(maxPower / (phases === 1 ? 220 : 380)),
      frequency: "50/60Hz",
      phases,
      
      // Eficiência
      maxEfficiency: 97 + (i % 30) * 0.1,
      europeanEfficiency: 96 + (i % 30) * 0.1,
      
      // Proteções
      protections: [
        "Sobretensão DC",
        "Sobrecorrente DC",
        "Sobretensão AC",
        "Anti-ilhamento",
        "Proteção de temperatura",
        "Proteção de isolamento",
      ],
      
      // Dimensões
      length: nominalPower < 10000 ? 450 : nominalPower < 30000 ? 600 : 800,
      width: nominalPower < 10000 ? 350 : nominalPower < 30000 ? 450 : 600,
      depth: nominalPower < 10000 ? 150 : nominalPower < 30000 ? 200 : 250,
      weight: nominalPower < 10000 ? 15 : nominalPower < 30000 ? 30 : 60,
      
      // Condições ambientais
      operatingTempRange: "-25°C a 60°C",
      ipRating: "IP65",
      
      // Comercial
      price: nominalPower * 0.8 + (i % 1000),
      warranty: 10,
      availability: i % 10 === 0 ? "SOB_ENCOMENDA" : i % 20 === 0 ? "INDISPONIVEL" : "DISPONIVEL",
      
      createdAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
      updatedAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
    });
  }
  
  return inverters;
};

let cachedInverters: Inverter[] | null = null;

export const getAllInverters = (): Inverter[] => {
  if (!cachedInverters) {
    cachedInverters = generateMockInverters(500);
  }
  return cachedInverters;
};

export const getInverterById = (id: string): Inverter | undefined => {
  return getAllInverters().find((inv) => inv.id === id);
};

export const getInverterManufacturers = (): string[] => {
  return manufacturers;
};

export const filterInverters = (
  filters: {
    search?: string;
    manufacturer?: string;
    system?: string;
    type?: string;
    minPower?: number;
    maxPower?: number;
    phases?: number;
    availability?: string;
  },
  page: number = 1,
  pageSize: number = 20
) => {
  let filtered = getAllInverters();
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (inv) =>
        inv.manufacturer.toLowerCase().includes(search) ||
        inv.model.toLowerCase().includes(search)
    );
  }
  
  if (filters.manufacturer) {
    filtered = filtered.filter((inv) => inv.manufacturer === filters.manufacturer);
  }
  
  if (filters.system) {
    filtered = filtered.filter((inv) => inv.system === filters.system);
  }
  
  if (filters.type) {
    filtered = filtered.filter((inv) => inv.type === filters.type);
  }
  
  if (filters.minPower) {
    filtered = filtered.filter((inv) => inv.nominalPower >= filters.minPower!);
  }
  
  if (filters.maxPower) {
    filtered = filtered.filter((inv) => inv.nominalPower <= filters.maxPower!);
  }
  
  if (filters.phases) {
    filtered = filtered.filter((inv) => inv.phases === filters.phases);
  }
  
  if (filters.availability) {
    filtered = filtered.filter((inv) => inv.availability === filters.availability);
  }
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const inverters = filtered.slice(start, end);
  
  return {
    inverters,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};
