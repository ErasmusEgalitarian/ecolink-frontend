import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  api,
  DONATION_ROUTES,
  SEMESTER_ROUTES,
  isApiConnectionError,
} from "../config/api";

const DONATIONS_LIMIT = 50;

export const useSemesterDonations = (semesterId = null) => {
  const [progress, setProgress] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setProgress(null);
        setDonations([]);
        return;
      }

      const progressUrl = semesterId
        ? SEMESTER_ROUTES.BY_ID_PROGRESS(semesterId)
        : SEMESTER_ROUTES.CURRENT_PROGRESS;

      const progressResponse = await api.get(progressUrl);
      const progressData = progressResponse.data?.data ?? null;
      setProgress(progressData);

      const donationParams = { page: 1, limit: DONATIONS_LIMIT };
      if (progressData?.startDate) {
        donationParams.startDate = progressData.startDate;
      }
      if (progressData?.endDate) {
        donationParams.endDate = progressData.endDate;
      }

      const donationsResponse = await api.get(DONATION_ROUTES.MY, {
        params: donationParams,
      });
      setDonations(donationsResponse.data?.data ?? []);
    } catch (error) {
      console.error("[useSemesterDonations] Error loading data:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setProgress(null);
        setDonations([]);
      }
    } finally {
      setLoading(false);
    }
  }, [semesterId]);

  return {
    progress,
    donations,
    loading,
    connectionError,
    fetchData,
  };
};
