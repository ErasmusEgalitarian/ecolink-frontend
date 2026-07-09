import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { api, PICKUP_ROUTES, isApiConnectionError } from "../config/api";

export const useCollectorPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(PICKUP_ROUTES.ACCEPTED, {
        params: { limit: 50 },
      });
      setPickups(response.data?.data ?? []);
    } catch (error) {
      console.error("[useCollectorPickups] Error loading pickups:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setPickups([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPickups();
    }, [fetchPickups]),
  );

  const activePickup =
    pickups.find((pickup) => pickup.pickupStatus === "accepted") ?? null;

  return {
    pickups,
    activePickup,
    loading,
    connectionError,
    refresh: fetchPickups,
  };
};
