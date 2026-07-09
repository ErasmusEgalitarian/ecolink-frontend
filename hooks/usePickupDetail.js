import { useCallback, useState } from "react";

import { api, PICKUP_ROUTES, isApiConnectionError } from "../config/api";

export const usePickupDetail = (pickupId) => {
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(Boolean(pickupId));
  const [connectionError, setConnectionError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPickup = useCallback(async () => {
    if (!pickupId) {
      setPickup(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(PICKUP_ROUTES.BY_ID(pickupId));
      setPickup(response.data?.data ?? null);
    } catch (error) {
      console.error("[usePickupDetail] Error loading pickup:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setPickup(null);
      }
    } finally {
      setLoading(false);
    }
  }, [pickupId]);

  const runAction = useCallback(
    async (route, successMessage) => {
      if (!pickupId) {
        return null;
      }

      setActionLoading(true);

      try {
        const response = await api.put(route);
        setPickup(response.data?.data ?? null);
        return { success: true, message: successMessage };
      } catch (error) {
        console.error("[usePickupDetail] Action failed:", error);
        const message =
          error?.response?.data?.message || error?.message || "Request failed";
        return { success: false, message };
      } finally {
        setActionLoading(false);
      }
    },
    [pickupId],
  );

  const acceptPickup = useCallback(
    () => runAction(PICKUP_ROUTES.ACCEPT(pickupId)),
    [pickupId, runAction],
  );

  const completePickup = useCallback(
    () => runAction(PICKUP_ROUTES.COMPLETE(pickupId)),
    [pickupId, runAction],
  );

  const cancelPickup = useCallback(
    () => runAction(PICKUP_ROUTES.CANCEL(pickupId)),
    [pickupId, runAction],
  );

  return {
    pickup,
    loading,
    connectionError,
    actionLoading,
    refresh: fetchPickup,
    acceptPickup,
    completePickup,
    cancelPickup,
  };
};
