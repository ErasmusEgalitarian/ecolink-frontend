import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SemesterDonationsView from "../components/SemesterDonationsView";
import {
  api,
  DONATION_ROUTES,
  SEMESTER_ROUTES,
  isApiConnectionError,
} from "../config/api";
import { goBackInDonationsStack } from "../utils/donationsNavigation";
import { styles } from "../styles/screens/MyDonationsScreen.styles";

const DONATIONS_LIMIT = 50;

const MyDonationsScreen = ({ navigation, route }) => {
  const semesterId = route?.params?.semesterId ?? null;

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
      console.error("[MyDonationsScreen] Error loading data:", error);
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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleBack = () => goBackInDonationsStack(navigation);

  const handleExportHistory = () => {
    // Reservado para exportação futura do histórico do semestre.
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <SemesterDonationsView
        donatedAmount={progress?.donatedAmount ?? 0}
        goalAmount={progress?.goalAmount ?? 0}
        percentage={progress?.percentage ?? 0}
        donations={donations}
        loading={loading}
        connectionError={connectionError}
        onBack={handleBack}
        onRetry={fetchData}
        onExportHistory={handleExportHistory}
      />
    </SafeAreaView>
  );
};

export default MyDonationsScreen;
