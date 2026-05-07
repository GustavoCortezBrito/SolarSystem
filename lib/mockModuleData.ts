import type { SolarModule } from "@/types/module";

// Dados mock de módulos fotovoltaicos
// Em produção, isso viria de uma API ou banco de dados

const manufacturers = [
  "AE SOLAR",
  "CANADIAN SOLAR",
  "JINKO SOLAR",
  "TRINA SOLAR",
  "JA SOLAR",
  "LONGi",
  "RISEN",
  "SUNTECH",
  "PHONO SOLAR",
  "ASTRONERGY",
];

// Gerar módulos mock (simulando 1000+ registros)
export const generateMockModules = (count: number = 1000): SolarModule[] => {
  const modules: SolarModule[] = [];
  
  for (let i = 0; i < count; i++) {
    const manufacturer = manufacturers[i % manufacturers.length];
    const power = 300 + (i % 50) * 10; // 300W a 790W
    const cells = power < 400 ? 72 : power < 500 ? 120 : 144;
    const efficiency = 17 + (i % 50) * 0.1; // 17% a 22%
    const cellType = i % 3 === 0 ? "MONOCRISTALINO" : i % 3 === 1 ? "POLICRISTALINO" : "FILME_FINO";
    
    modules.push({
      id: `module-${i + 1}`,
      manufacturer,
      model: `${manufacturer.split(" ")[0]}${power}M6-${cells}`,
      power,
      cells,
      efficiency: parseFloat(efficiency.toFixed(2)),
      cellType,
      
      // Dimensões (variam com o número de células)
      length: cells === 72 ? 1956 : cells === 120 ? 2094 : 2278,
      width: cells === 72 ? 992 : cells === 120 ? 1038 : 1134,
      depth: 40,
      weight: cells === 72 ? 22 : cells === 120 ? 28 : 32,
      
      // Especificações elétricas
      voltage: 1000,
      vmp: parseFloat((power / 10).toFixed(2)),
      imp: parseFloat((power / (power / 10)).toFixed(2)),
      voc: parseFloat((power / 10 + 7).toFixed(2)),
      isc: parseFloat((power / (power / 10) + 0.5).toFixed(2)),
      
      // Coeficientes de temperatura
      tempCoefficientPmax: -0.0038 - (i % 10) * 0.0001,
      tempCoefficientVoc: -0.0029 - (i % 10) * 0.0001,
      tempCoefficientIsc: 0.0005,
      
      // Informações comerciais
      price: power * 1.5 + (i % 100), // Preço aproximado
      warranty: 25,
      availability: i % 10 === 0 ? "SOB_ENCOMENDA" : i % 20 === 0 ? "INDISPONIVEL" : "DISPONIVEL",
      
      createdAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
      updatedAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
    });
  }
  
  return modules;
};

// Cache dos módulos gerados
let cachedModules: SolarModule[] | null = null;

export const getAllModules = (): SolarModule[] => {
  if (!cachedModules) {
    cachedModules = generateMockModules(1000);
  }
  return cachedModules;
};

export const getModuleById = (id: string): SolarModule | undefined => {
  return getAllModules().find((m) => m.id === id);
};

export const getManufacturers = (): string[] => {
  return manufacturers;
};

// Função para filtrar e paginar módulos
export const filterModules = (
  filters: {
    search?: string;
    manufacturer?: string;
    cellType?: string;
    minPower?: number;
    maxPower?: number;
    minEfficiency?: number;
    availability?: string;
  },
  page: number = 1,
  pageSize: number = 20
) => {
  let filtered = getAllModules();
  
  // Aplicar filtros
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.manufacturer.toLowerCase().includes(search) ||
        m.model.toLowerCase().includes(search)
    );
  }
  
  if (filters.manufacturer) {
    filtered = filtered.filter((m) => m.manufacturer === filters.manufacturer);
  }
  
  if (filters.cellType) {
    filtered = filtered.filter((m) => m.cellType === filters.cellType);
  }
  
  if (filters.minPower) {
    filtered = filtered.filter((m) => m.power >= filters.minPower!);
  }
  
  if (filters.maxPower) {
    filtered = filtered.filter((m) => m.power <= filters.maxPower!);
  }
  
  if (filters.minEfficiency) {
    filtered = filtered.filter((m) => m.efficiency >= filters.minEfficiency!);
  }
  
  if (filters.availability) {
    filtered = filtered.filter((m) => m.availability === filters.availability);
  }
  
  // Calcular paginação
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const modules = filtered.slice(start, end);
  
  return {
    modules,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};
