"use client";

import { useLocationSelector } from "@/lib/useIBGE";
import { Loader2 } from "lucide-react";

interface LocationSelectorProps {
  stateValue: string;       // ID numérico do estado (IBGE)
  cityValue: string;        // Nome da cidade
  onStateChange: (stateId: string, stateSigla: string) => void;
  onCityChange: (city: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function LocationSelector({
  stateValue,
  cityValue,
  onStateChange,
  onCityChange,
  required = false,
  disabled = false,
}: LocationSelectorProps) {
  const {
    states,
    cities,
    loadingStates,
    loadingCities,
    selectedStateId,
    handleStateChange,
    handleCityChange,
  } = useLocationSelector(stateValue, cityValue);

  const handleState = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    handleStateChange(stateId);
    const sigla = states.find((s) => String(s.id) === stateId)?.sigla ?? "";
    onStateChange(stateId, sigla);
  };

  const handleCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleCityChange(e.target.value);
    onCityChange(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={selectedStateId}
            onChange={handleState}
            disabled={disabled || loadingStates}
            required={required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
          >
            <option value="">
              {loadingStates ? "Carregando..." : "Selecione o estado"}
            </option>
            {states.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.sigla} – {s.nome}
              </option>
            ))}
          </select>
          {loadingStates && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Cidade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cidade {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={cityValue}
            onChange={handleCity}
            disabled={disabled || !selectedStateId || loadingCities}
            required={required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
          >
            <option value="">
              {!selectedStateId
                ? "Selecione o estado primeiro"
                : loadingCities
                ? "Carregando cidades..."
                : "Selecione a cidade"}
            </option>
            {cities.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
          {loadingCities && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}
