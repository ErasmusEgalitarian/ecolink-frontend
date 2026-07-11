import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import SemesterDonationsView from "../components/SemesterDonationsView";
import { useSemesterDonations } from "../hooks/useSemesterDonations";
import { goBackInProfileStack } from "../utils/profileNavigation";
import { styles } from "../styles/screens/MyDonationsScreen.styles";

const ProfileSemesterDonationsScreen = ({ navigation, route }) => {
  const semesterId = route?.params?.semesterId ?? null;
  const semesterName = route?.params?.semesterName ?? null;

  const {
    progress,
    donations,
    loading,
    connectionError,
    fetchData,
  } = useSemesterDonations(semesterId);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleBack = () =>
    goBackInProfileStack(navigation, {
      fallbackScreen: "DonationHistoryScreen",
    });

  const handleExportHistory = () => {
    // Reservado para exportação futura do histórico do semestre.
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <SemesterDonationsView
        title={semesterName ?? progress?.name}
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

export default ProfileSemesterDonationsScreen;
