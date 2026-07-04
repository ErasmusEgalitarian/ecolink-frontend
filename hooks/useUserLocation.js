import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";

export const LOCATION_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  GRANTED: "granted",
  DENIED: "denied",
  UNAVAILABLE: "unavailable",
  ERROR: "error",
};

/**
 * Resolve a localização real do usuário usando expo-location.
 *
 * Pede a permissão de localização (foreground) e busca a posição atual.
 * Funciona em iOS, Android e web (na web o expo-location usa a Geolocation
 * API do navegador). Não há coordenada de fallback: se a permissão for negada
 * ou a posição não puder ser obtida, `coords` permanece null e `status`
 * reflete o motivo, para que a UI possa orientar o usuário.
 *
 * `resolve` retorna um resumo ({ granted, canAskAgain }) para que a tela possa
 * decidir, após uma interação, se mostra o diálogo novamente ou encaminha o
 * usuário para as Configurações do sistema.
 */
export const useUserLocation = () => {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState(LOCATION_STATUS.IDLE);
  const [canAskAgain, setCanAskAgain] = useState(true);

  const resolve = useCallback(async ({ request = true } = {}) => {
    setStatus(LOCATION_STATUS.LOADING);

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setCoords(null);
        setStatus(LOCATION_STATUS.UNAVAILABLE);
        return { granted: false, canAskAgain: true };
      }

      let permission = await Location.getForegroundPermissionsAsync();
      if (permission.status !== "granted" && permission.canAskAgain && request) {
        permission = await Location.requestForegroundPermissionsAsync();
      }

      setCanAskAgain(permission.canAskAgain);

      if (permission.status !== "granted") {
        setCoords(null);
        setStatus(LOCATION_STATUS.DENIED);
        return { granted: false, canAskAgain: permission.canAskAgain };
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setStatus(LOCATION_STATUS.GRANTED);
      return { granted: true, canAskAgain: permission.canAskAgain };
    } catch (error) {
      console.error("Error resolving user location:", error);
      setCoords(null);
      setStatus(LOCATION_STATUS.ERROR);
      return { granted: false, canAskAgain: false };
    }
  }, []);

  useEffect(() => {
    resolve({ request: true });
  }, [resolve]);

  return {
    coords,
    status,
    canAskAgain,
    loading:
      status === LOCATION_STATUS.LOADING || status === LOCATION_STATUS.IDLE,
    denied: status === LOCATION_STATUS.DENIED,
    unavailable: status === LOCATION_STATUS.UNAVAILABLE,
    error: status === LOCATION_STATUS.ERROR,
    refresh: resolve,
  };
};
