"use client";

import { useState, useEffect, useCallback } from "react";

export interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGECity {
  id: number;
  nome: string;
}

// Cache simples para evitar requisições repetidas
let statesCache: IBGEState[] | null = null;
const citiesCache: Record<string, IBGECity[]> = {};

export function useIBGEStates() {
  const [states, setStates] = useState<IBGEState[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (statesCache) {
      setStates(statesCache);
      return;
    }
    setLoading(true);
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((r) => r.json())
      .then((data: IBGEState[]) => {
        statesCache = data;
        setStates(data);
      })
      .catch(() => setError("Erro ao carregar estados"))
      .finally(() => setLoading(false));
  }, []);

  return { states, loading, error };
}

export function useIBGECities(stateId: string) {
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stateId) {
      setCities([]);
      return;
    }
    if (citiesCache[stateId]) {
      setCities(citiesCache[stateId]);
      return;
    }
    setLoading(true);
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`
    )
      .then((r) => r.json())
      .then((data: IBGECity[]) => {
        citiesCache[stateId] = data;
        setCities(data);
      })
      .catch(() => setError("Erro ao carregar cidades"))
      .finally(() => setLoading(false));
  }, [stateId]);

  return { cities, loading, error };
}

// Hook combinado para seleção de estado + cidade
export function useLocationSelector(initialStateId = "", initialCity = "") {
  const [selectedStateId, setSelectedStateId] = useState(initialStateId);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const { states, loading: loadingStates } = useIBGEStates();
  const { cities, loading: loadingCities } = useIBGECities(selectedStateId);

  const handleStateChange = useCallback((stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedCity(""); // Limpa cidade ao trocar estado
  }, []);

  const handleCityChange = useCallback((cityName: string) => {
    setSelectedCity(cityName);
  }, []);

  const selectedStateSigla =
    states.find((s) => String(s.id) === selectedStateId)?.sigla ?? "";

  return {
    states,
    cities,
    loadingStates,
    loadingCities,
    selectedStateId,
    selectedCity,
    selectedStateSigla,
    handleStateChange,
    handleCityChange,
  };
}
