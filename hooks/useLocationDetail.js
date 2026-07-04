import { useState, useCallback } from "react";
import { api, LOCATION_ROUTES, isApiConnectionError } from "../config/api";

export const useLocationDetail = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchLocation = useCallback(async (locationId) => {
    if (!locationId) {
      return null;
    }

    setLoading(true);
    setConnectionError(false);
    setNotFound(false);

    try {
      const response = await api.get(LOCATION_ROUTES.BY_ID(locationId));
      const data = response.data?.data || null;
      setLocation(data);
      return data;
    } catch (error) {
      console.error("Error fetching location detail:", error);
      if (error.response?.status === 404) {
        setNotFound(true);
      } else if (isApiConnectionError(error)) {
        setConnectionError(true);
      }
      setLocation(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, connectionError, notFound, fetchLocation };
};
