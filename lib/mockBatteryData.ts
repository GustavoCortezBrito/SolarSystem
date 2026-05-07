import type { Battery } from "@/types/battery";

const manufacturers = [
  "UNIPOWER",
  "WEG",
  "SOLUNA",
  "GOODWE",
  "BYD",
  "PYLONTECH",
  "DYNESS",
  "HUAWEI",
  "LG",
  "TESLA",
];

// Gerar baterias mock
export const generateMockBatteries = (count: number = 200): Battery[] => {
  const batteries: Battery[] = [];
  
  for (let i = 0; i < count; i++) {
    const manufacturer = manufacturers[i % manufacturers.length];
    const voltage = [12, 24, 48, 51.2, 192, 384][i % 6];
    const capacity = 2.4 + (i % 50) * 0.5; // 2.4kWh a 27.4kWh
    const type = i % 4 === 0 ? "LITIO" : i % 4 === 1 ? "CHUMBO_ACIDO" : i % 4 === 2 ? "GEL" : "AGM";
    
    batteries.push({
      id: `battery-${i + 1}`,
      manufacturer,
      model: `${manufacturer.split(" ")[0]}-${voltage}V-${capacity.toFixed(1)}kWh`,
      
      type,
      
      voltage,
      capacity,
      usableCapacity: type === "LITIO" ? capacity * 0.95 : capacity * 0.5,
      
      // Correntes
      maxDischargeCurrent: Math.round((capacity * 1000) / voltage),
      maxChargeCurrent: Math.round((capacity * 1000) / voltage * 0.5),
      continuousDischargeCurrent: Math.round((capacity * 1000) / voltage * 0.8),
      continuousChargeCurrent: Math.round((capacity * 1000) / voltage * 0.4),
      
      // Ciclos
      cycleLife: type === "LITIO" ? 6000 : type === "GEL" ? 1500 : 800,
      dod: type === "LITIO" ? 95 : type === "GEL" ? 50 : 50,
      warranty: type === "LITIO" ? 10 : 5,
      
      // Dimensões
      length: voltage <= 48 ? 450 : 600,
      width: voltage <= 48 ? 350 : 500,
      depth: voltage <= 48 ? 200 : 250,
      weight: capacity * (type === "LITIO" ? 10 : 20),
      
      // Condições
      operatingTempRange: type === "LITIO" ? "-10°C a 50°C" : "0°C a 40°C",
      ipRating: type === "LITIO" ? "IP65" : "IP20",
      
      // Características
      features: type === "LITIO" 
        ? ["BMS integrado", "Expansível", "Comunicação CAN", "Proteção contra sobrecarga"]
        : ["Manutenção reduzida", "Ciclo profundo"],
      
      // Compatibilidade
      compatibleInverters: ["Growatt", "Deye", "Goodwe", "Sofar"],
      
      // Comercial
      price: capacity * (type === "LITIO" ? 2500 : 1000) + (i % 500),
      availability: i % 10 === 0 ? "SOB_ENCOMENDA" : i % 20 === 0 ? "INDISPONIVEL" : "DISPONIVEL",
      
      createdAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
      updatedAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
    });
  }
  
  return batteries;
};

let cachedBatteries: Battery[] | null = null;

export const getAllBatteries = (): Battery[] => {
  if (!cachedBatteries) {
    cachedBatteries = generateMockBatteries(200);
  }
  return cachedBatteries;
};

export const getBatteryById = (id: string): Battery | undefined => {
  return getAllBatteries().find((bat) => bat.id === id);
};

export const getBatteryManufacturers = (): string[] => {
  return manufacturers;
};

export const filterBatteries = (
  filters: {
    search?: string;
    manufacturer?: string;
    type?: string;
    voltage?: number;
    minCapacity?: number;
    maxCapacity?: number;
    availability?: string;
  },
  page: number = 1,
  pageSize: number = 20
) => {
  let filtered = getAllBatteries();
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (bat) =>
        bat.manufacturer.toLowerCase().includes(search) ||
        bat.model.toLowerCase().includes(search)
    );
  }
  
  if (filters.manufacturer) {
    filtered = filtered.filter((bat) => bat.manufacturer === filters.manufacturer);
  }
  
  if (filters.type) {
    filtered = filtered.filter((bat) => bat.type === filters.type);
  }
  
  if (filters.voltage) {
    filtered = filtered.filter((bat) => bat.voltage === filters.voltage);
  }
  
  if (filters.minCapacity) {
    filtered = filtered.filter((bat) => bat.capacity >= filters.minCapacity!);
  }
  
  if (filters.maxCapacity) {
    filtered = filtered.filter((bat) => bat.capacity <= filters.maxCapacity!);
  }
  
  if (filters.availability) {
    filtered = filtered.filter((bat) => bat.availability === filters.availability);
  }
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const batteries = filtered.slice(start, end);
  
  return {
    batteries,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};
