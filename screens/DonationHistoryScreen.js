import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import ConnectionErrorCard from "../components/ConnectionErrorCard";
import SemesterHistoryCard from "../components/SemesterHistoryCard";
import { api, SEMESTER_ROUTES, isApiConnectionError } from "../config/api";
import { goBackInProfileStack } from "../utils/profileNavigation";
import { styles } from "../styles/screens/DonationHistoryScreen.styles";

const DonationHistoryScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchSemesters = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(SEMESTER_ROUTES.PROGRESS);
      const progressList = response.data?.data ?? [];
      const donatedSemesters = progressList.filter(
        (semester) => (semester.donatedAmount ?? 0) > 0,
      );
      setSemesters(donatedSemesters);
    } catch (error) {
      console.error("[DonationHistoryScreen] Error loading semesters:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setSemesters([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSemesters();
    }, [fetchSemesters]),
  );

  const handleBack = () => goBackInProfileStack(navigation);

  const handleSemesterPress = (semester) => {
    navigation.navigate("ProfileSemesterDonationsScreen", {
      semesterId: semester.semesterId,
      semesterName: semester.name,
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29A66C" />
        </View>
      );
    }

    if (connectionError) {
      return <ConnectionErrorCard onRetry={fetchSemesters} />;
    }

    if (semesters.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t("DonationHistory.emptyTitle")}</Text>
          <Text style={styles.emptyMessage}>
            {t("DonationHistory.emptyMessage")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {semesters.map((semester) => (
          <View key={semester.semesterId} style={styles.gridItem}>
            <SemesterHistoryCard
              semester={semester}
              onPress={handleSemesterPress}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
            accessibilityLabel={t("QRScanner.backButton")}
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{t("DonationHistory.title")}</Text>
        <Text style={styles.subtitle}>{t("DonationHistory.subtitle")}</Text>

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DonationHistoryScreen;
