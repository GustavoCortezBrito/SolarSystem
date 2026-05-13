"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { filterModules, getManufacturers } from "@/lib/mockModuleData";
import type { SolarModule } from "@/types/module";

export default function ModulesPage() {
  const [modules, setModules] = useState<SolarModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<SolarModule | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState({
    search: "",
    manufacturer: "",
    cellType: "",
    minPower: "",
    maxPower: "",
    minEfficiency: "",
    availability: "",
  });

  const manufacturers = getManufacturers();

  // Carregar módulos
  useEffect(() => {
    loadModules();
  }, [page, pageSize, filters]);

  const loadModules = () => {
    const result = filterModules(
      {
        search: filters.search,
        manufacturer: filters.manufacturer || undefined,
        cellType: filters.cellType || undefined,
        minPower: filters.minPower ? parseFloat(filters.minPower) : undefined,
        maxPower: filters.maxPower ? parseFloat(filters.maxPower) : undefined,
        minEfficiency: filters.minEfficiency ? parseFloat(filters.minEfficiency) : undefined,
        availability: filters.availability || undefined,
      },
      page,
      pageSize
    );
    
    setModules(result.modules);
    setTotalPages(result.pagination.totalPages);
    setTotal(result.pagination.total);
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
    setPage(1); // Reset para primeira página
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      manufacturer: "",
      cellType: "",
      minPower: "",
      maxPower: "",
      minEfficiency: "",
      availability: "",
    });
    setPage(1);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/board"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Catálogo de Módulos</h1>
                <p className="text-sm text-gray-500">
                  {total} módulos cadastrados
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Busca */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por fabricante ou modelo..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </header>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Fabricante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabricante
                </label>
                <select
                  value={filters.manufacturer}
                  onChange={(e) => handleFilterChange("manufacturer", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  {manufacturers.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Célula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Célula
                </label>
                <select
                  value={filters.cellType}
                  onChange={(e) => handleFilterChange("cellType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="MONOCRISTALINO">Monocristalino</option>
                  <option value="POLICRISTALINO">Policristalino</option>
                  <option value="FILME_FINO">Filme Fino</option>
                </select>
              </div>

              {/* Potência Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potência Mín. (W)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 400"
                  value={filters.minPower}
                  onChange={(e) => handleFilterChange("minPower", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Potência Máxima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potência Máx. (W)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 600"
                  value={filters.maxPower}
                  onChange={(e) => handleFilterChange("maxPower", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Eficiência Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eficiência Mín. (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 20"
                  value={filters.minEfficiency}
                  onChange={(e) => handleFilterChange("minEfficiency", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Disponibilidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilidade
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange("availability", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="SOB_ENCOMENDA">Sob Encomenda</option>
                  <option value="INDISPONIVEL">Indisponível</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-700">Mostrar:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Módulos */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Potência (W)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Células
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eficiência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponibilidade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modules.map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {module.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {module.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {module.power}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {module.cells}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {module.efficiency}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {module.cellType === "MONOCRISTALINO"
                          ? "Mono"
                          : module.cellType === "POLICRISTALINO"
                          ? "Poli"
                          : "Filme"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          module.availability === "DISPONIVEL"
                            ? "bg-green-100 text-green-800"
                            : module.availability === "SOB_ENCOMENDA"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {module.availability === "DISPONIVEL"
                          ? "Disponível"
                          : module.availability === "SOB_ENCOMENDA"
                          ? "Sob Encomenda"
                          : "Indisponível"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSelectedModule(module)}
                        className="text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        <Eye className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {(page - 1) * pageSize + 1} a{" "}
                {Math.min(page * pageSize, total)} de {total} módulos
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-700">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedModule.manufacturer} {selectedModule.model}
                </h2>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Especificações Básicas */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Especificações Básicas
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Potência:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.power} W
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tipo de célula:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.cellType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Número de células:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.cells}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Eficiência:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.efficiency}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dimensões */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Dimensões e Peso
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tamanho (CxLxP):</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.length}×{selectedModule.width}×{selectedModule.depth}mm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Peso:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.weight} kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Especificações Elétricas */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Especificações Elétricas
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tensão:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.voltage} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tensão de operação Vmp:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.vmp} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Corrente de operação Imp:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.imp} A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tensão de circuito aberto Voc:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.voc} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Corrente de curto circuito Isc:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.isc} A
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coeficientes de Temperatura */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Coeficientes de Temperatura
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pmax / Voc / Isc:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.tempCoefficientPmax.toFixed(4)} /{" "}
                        {selectedModule.tempCoefficientVoc.toFixed(4)} /{" "}
                        {selectedModule.tempCoefficientIsc.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informações Comerciais */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Informações Comerciais
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedModule.price && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preço:</span>
                        <span className="text-sm font-medium text-gray-900">
                          R$ {selectedModule.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Garantia:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedModule.warranty} anos
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Disponibilidade:</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedModule.availability === "DISPONIVEL"
                            ? "text-green-600"
                            : selectedModule.availability === "SOB_ENCOMENDA"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedModule.availability === "DISPONIVEL"
                          ? "Disponível"
                          : selectedModule.availability === "SOB_ENCOMENDA"
                          ? "Sob Encomenda"
                          : "Indisponível"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
