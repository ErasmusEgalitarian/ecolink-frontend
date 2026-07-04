import { useState, useCallback } from "react";
import { api, LOCATION_ROUTES, isApiConnectionError } from "../config/api";

/**
 * Hook para consultar locais com ecopontos a partir de uma posição.
 * A API retorna locais ordenados por status agregado/distância, cada um
 * com ecopontos aninhados e materiais aceitos unificados.
 */
export const useAvailableEcopoints = () => {
  const [locations, setLocations] = useState([]);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const fetchAvailable = useCallback(
    async ({ lat, lng, materialType, limit } = {}) => {
      if (lat == null || lng == null) {
        return;
      }

      setLoading(true);
      setConnectionError(false);

      try {
        const response = await api.get(LOCATION_ROUTES.AVAILABLE, {
          params: {
            lat,
            lng,
            ...(materialType ? { materialType } : {}),
            ...(limit ? { limit } : {}),
          },
        });

        const result = response.data || {};
        setLocations(Array.isArray(result.data) ? result.data : []);
        setAvailable(Boolean(result.available));
      } catch (error) {
        console.error("Error fetching available locations:", error);
        if (isApiConnectionError(error)) {
          setConnectionError(true);
        }
        setLocations([]);
        setAvailable(false);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { locations, available, loading, connectionError, fetchAvailable };
};
