"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, ArrowLeft, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { filterOptimizers, getOptimizerManufacturers } from "@/lib/mockOptimizerData";
import type { Optimizer } from "@/types/optimizer";

export default function OptimizersPage() {
  const [optimizers, setOptimizers] = useState<Optimizer[]>([]);
  const [selectedOptimizer, setSelectedOptimizer] = useState<Optimizer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState({
    search: "",
    manufacturer: "",
    minPower: "",
    maxPower: "",
    modulesPerOptimizer: "",
    availability: "",
  });

  const manufacturers = getOptimizerManufacturers();

  useEffect(() => {
    loadOptimizers();
  }, [page, pageSize, filters]);

  const loadOptimizers = () => {
    const result = filterOptimizers(
      {
        search: filters.search,
        manufacturer: filters.manufacturer || undefined,
        minPower: filters.minPower ? parseFloat(filters.minPower) : undefined,
        maxPower: filters.maxPower ? parseFloat(filters.maxPower) : undefined,
        modulesPerOptimizer: filters.modulesPerOptimizer ? parseInt(filters.modulesPerOptimizer) : undefined,
        availability: filters.availability || undefined,
      },
      page,
      pageSize
    );
    
    setOptimizers(result.optimizers);
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
      minPower: "",
      maxPower: "",
      modulesPerOptimizer: "",
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
                <h1 className="text-2xl font-bold text-gray-900">Catálogo de Otimizadores</h1>
                <p className="text-sm text-gray-500">
                  {total} otimizadores cadastrados
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                  placeholder="Ex: 1000"
                  value={filters.maxPower}
                  onChange={(e) => handleFilterChange("maxPower", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Módulos por Otimizador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Módulos/Otimizador
                </label>
                <select
                  value={filters.modulesPerOptimizer}
                  onChange={(e) => handleFilterChange("modulesPerOptimizer", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="1">1 módulo</option>
                  <option value="2">2 módulos</option>
                  <option value="4">4 módulos</option>
                </select>
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

      {/* Tabela de Otimizadores */}
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
                    Máx. Tensão Entrada (V)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Máx. Corrente Curto Circuito (A)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Módulos/Otimizador
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {optimizers.map((optimizer) => (
                  <tr key={optimizer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {optimizer.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {optimizer.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {optimizer.power}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {optimizer.maxInputVoltage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {optimizer.maxShortCircuitCurrent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                        {optimizer.modulesPerOptimizer} {optimizer.modulesPerOptimizer === 1 ? "módulo" : "módulos"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSelectedOptimizer(optimizer)}
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
                {Math.min(page * pageSize, total)} de {total} otimizadores
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
      {selectedOptimizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedOptimizer.manufacturer} {selectedOptimizer.model}
                </h2>
                <button
                  onClick={() => setSelectedOptimizer(null)}
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
                        {selectedOptimizer.power} W
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Módulos por otimizador:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.modulesPerOptimizer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Comprimento máx. string:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.maxStringLength}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Eficiência máxima:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.maxEfficiency.toFixed(1)}%
                      </span>
                    </div>
                    {selectedOptimizer.weightedEfficiency && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Eficiência ponderada:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedOptimizer.weightedEfficiency.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Entrada */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Especificações de Entrada
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tensão máxima:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.maxInputVoltage} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Corrente máxima:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.maxInputCurrent} A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Faixa MPPT:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.mpptVoltageRange}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Saída */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Especificações de Saída
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tensão máxima:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.maxOutputVoltage} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Corrente máxima:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.maxOutputCurrent} A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Corrente curto circuito:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.maxShortCircuitCurrent} A
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
                        {selectedOptimizer.length}×{selectedOptimizer.width}×{selectedOptimizer.depth}mm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Peso:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.weight} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Grau de proteção:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.ipRating}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Temp. operação:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.operatingTempRange}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comunicação */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Comunicação e Monitoramento
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Protocolos:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedOptimizer.communication.map((comm, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {comm}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Monitoramento por módulo:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.monitoring ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proteções */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Proteções
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOptimizer.protections.map((protection, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800"
                      >
                        {protection}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compatibilidade */}
                {selectedOptimizer.compatibleInverters && selectedOptimizer.compatibleInverters.length > 0 && (
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Inversores Compatíveis
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOptimizer.compatibleInverters.map((inverter, index) => (
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
                  <div className="grid grid-cols-3 gap-4">
                    {selectedOptimizer.price && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preço:</span>
                        <span className="text-sm font-medium text-gray-900">
                          R$ {selectedOptimizer.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Garantia:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOptimizer.warranty} anos
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Disponibilidade:</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedOptimizer.availability === "DISPONIVEL"
                            ? "text-green-600"
                            : selectedOptimizer.availability === "SOB_ENCOMENDA"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedOptimizer.availability === "DISPONIVEL"
                          ? "Disponível"
                          : selectedOptimizer.availability === "SOB_ENCOMENDA"
                          ? "Sob Encomenda"
                          : "Indisponível"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOptimizer(null)}
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
