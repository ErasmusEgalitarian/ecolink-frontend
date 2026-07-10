import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { api, PICKUP_ROUTES, isApiConnectionError } from "../config/api";

export const usePendingPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(PICKUP_ROUTES.PENDING, {
        params: { limit: 50 },
      });
      setPickups(response.data?.data ?? []);
    } catch (error) {
      console.error("[usePendingPickups] Error loading pickups:", error);
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

  return {
    pickups,
    loading,
    connectionError,
    refresh: fetchPickups,
  };
};

export const useAcceptedPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(PICKUP_ROUTES.ACCEPTED, {
        params: { limit: 100 },
      });
      setPickups(response.data?.data ?? []);
    } catch (error) {
      console.error("[useAcceptedPickups] Error loading pickups:", error);
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

  return {
    pickups,
    loading,
    connectionError,
    refresh: fetchPickups,
  };
};

export const usePickupDetail = (pickupId) => {
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(Boolean(pickupId));
  const [connectionError, setConnectionError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchPickup = useCallback(async () => {
    if (!pickupId) {
      setPickup(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setConnectionError(false);
    setNotFound(false);

    try {
      const response = await api.get(PICKUP_ROUTES.BY_ID(pickupId));
      setPickup(response.data?.data ?? null);
    } catch (error) {
      console.error("[usePickupDetail] Error loading pickup:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else if (error?.status === 404) {
        setNotFound(true);
        setPickup(null);
      } else {
        setPickup(null);
      }
    } finally {
      setLoading(false);
    }
  }, [pickupId]);

  useFocusEffect(
    useCallback(() => {
      fetchPickup();
    }, [fetchPickup]),
  );

  return {
    pickup,
    loading,
    connectionError,
    notFound,
    refresh: fetchPickup,
  };
};

export const usePickupActions = () => {
  const [submitting, setSubmitting] = useState(false);

  const acceptPickup = useCallback(async (pickupId) => {
    setSubmitting(true);
    try {
      const response = await api.put(PICKUP_ROUTES.ACCEPT(pickupId));
      return response.data?.data ?? null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const completePickup = useCallback(async (pickupId) => {
    setSubmitting(true);
    try {
      const response = await api.put(PICKUP_ROUTES.COMPLETE(pickupId));
      return response.data?.data ?? null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const cancelPickup = useCallback(async (pickupId) => {
    setSubmitting(true);
    try {
      const response = await api.put(PICKUP_ROUTES.CANCEL(pickupId));
      return response.data?.data ?? null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    submitting,
    acceptPickup,
    completePickup,
    cancelPickup,
  };
};
