"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, ArrowLeft, ChevronLeft, ChevronRight, Battery as BatteryIcon } from "lucide-react";
import Link from "next/link";
import { filterBatteries, getBatteryManufacturers } from "@/lib/mockBatteryData";
import type { Battery } from "@/types/battery";

export default function BatteriesPage() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState({
    search: "",
    manufacturer: "",
    type: "",
    voltage: "",
    minCapacity: "",
    maxCapacity: "",
    availability: "",
  });

  const manufacturers = getBatteryManufacturers();

  useEffect(() => {
    loadBatteries();
  }, [page, pageSize, filters]);

  const loadBatteries = () => {
    const result = filterBatteries(
      {
        search: filters.search,
        manufacturer: filters.manufacturer || undefined,
        type: filters.type || undefined,
        voltage: filters.voltage ? parseFloat(filters.voltage) : undefined,
        minCapacity: filters.minCapacity ? parseFloat(filters.minCapacity) : undefined,
        maxCapacity: filters.maxCapacity ? parseFloat(filters.maxCapacity) : undefined,
        availability: filters.availability || undefined,
      },
      page,
      pageSize
    );
    
    setBatteries(result.batteries);
    setTotalPages(result.pagination.totalPages);
    setTotal(result.pagination.total);
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      manufacturer: "",
      type: "",
      voltage: "",
      minCapacity: "",
      maxCapacity: "",
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
                <h1 className="text-2xl font-bold text-gray-900">Catálogo de Baterias</h1>
                <p className="text-sm text-gray-500">
                  {total} baterias cadastradas
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

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="LITIO">Lítio</option>
                  <option value="CHUMBO_ACIDO">Chumbo-ácido</option>
                  <option value="GEL">Gel</option>
                  <option value="AGM">AGM</option>
                </select>
              </div>

              {/* Tensão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tensão (V)
                </label>
                <select
                  value={filters.voltage}
                  onChange={(e) => handleFilterChange("voltage", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todas</option>
                  <option value="12">12V</option>
                  <option value="24">24V</option>
                  <option value="48">48V</option>
                  <option value="51.2">51.2V</option>
                  <option value="192">192V</option>
                  <option value="384">384V</option>
                </select>
              </div>

              {/* Capacidade Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade Mín. (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 5"
                  value={filters.minCapacity}
                  onChange={(e) => handleFilterChange("minCapacity", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Capacidade Máxima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade Máx. (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 20"
                  value={filters.maxCapacity}
                  onChange={(e) => handleFilterChange("maxCapacity", e.target.value)}
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

      {/* Tabela de Baterias */}
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
                    Energia (kWh)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tensão (V)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Corrente Máx. Descarga (A)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Corrente Máx. Carga (A)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batteries.map((battery) => (
                  <tr key={battery.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {battery.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {battery.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {battery.capacity.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {battery.voltage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {battery.maxDischargeCurrent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {battery.maxChargeCurrent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        battery.type === "LITIO" ? "bg-green-100 text-green-800" :
                        battery.type === "GEL" ? "bg-blue-100 text-blue-800" :
                        battery.type === "AGM" ? "bg-purple-100 text-purple-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {battery.type === "LITIO" ? "Lítio" :
                         battery.type === "CHUMBO_ACIDO" ? "Chumbo" :
                         battery.type === "GEL" ? "Gel" : "AGM"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSelectedBattery(battery)}
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
                {Math.min(page * pageSize, total)} de {total} baterias
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
      {selectedBattery && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedBattery.manufacturer} {selectedBattery.model}
                </h2>
                <button
                  onClick={() => setSelectedBattery(null)}
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
                      <span className="text-sm text-gray-600">Tipo:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.type === "LITIO" ? "Lítio" :
                         selectedBattery.type === "CHUMBO_ACIDO" ? "Chumbo-ácido" :
                         selectedBattery.type === "GEL" ? "Gel" : "AGM"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tensão:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.voltage} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Capacidade:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.capacity.toFixed(1)} kWh
                      </span>
                    </div>
                    {selectedBattery.usableCapacity && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Capacidade útil:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedBattery.usableCapacity.toFixed(1)} kWh
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">DoD:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.dod}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Correntes */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Correntes
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Máx. descarga:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.maxDischargeCurrent} A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Máx. carga:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.maxChargeCurrent} A
                      </span>
                    </div>
                    {selectedBattery.continuousDischargeCurrent && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Contínua descarga:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedBattery.continuousDischargeCurrent} A
                        </span>
                      </div>
                    )}
                    {selectedBattery.continuousChargeCurrent && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Contínua carga:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedBattery.continuousChargeCurrent} A
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ciclos e Vida Útil */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Ciclos e Vida Útil
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ciclos de vida:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.cycleLife.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Garantia:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.warranty} anos
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
                      <span className="text-sm text-gray-600">Dimensões (CxLxP):</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.length}×{selectedBattery.width}×{selectedBattery.depth}mm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Peso:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.weight.toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Grau de proteção:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.ipRating}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Temp. operação:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBattery.operatingTempRange}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Características */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Características
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBattery.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compatibilidade */}
                {selectedBattery.compatibleInverters && selectedBattery.compatibleInverters.length > 0 && (
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Inversores Compatíveis
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBattery.compatibleInverters.map((inverter, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                        >
                          {inverter}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações Comerciais */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Informações Comerciais
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedBattery.price && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preço:</span>
                        <span className="text-sm font-medium text-gray-900">
                          R$ {selectedBattery.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Disponibilidade:</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedBattery.availability === "DISPONIVEL"
                            ? "text-green-600"
                            : selectedBattery.availability === "SOB_ENCOMENDA"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedBattery.availability === "DISPONIVEL"
                          ? "Disponível"
                          : selectedBattery.availability === "SOB_ENCOMENDA"
                          ? "Sob Encomenda"
                          : "Indisponível"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBattery(null)}
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
