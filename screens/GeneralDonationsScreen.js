import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

import DonutChart from "../components/DonutChart";
import ConnectionErrorCard from "../components/ConnectionErrorCard";
import { api, SEMESTER_ROUTES, isApiConnectionError } from "../config/api";
import { goBackInDonationsStack } from "../utils/donationsNavigation";
import {
  RECYCLING_MATERIALS,
  getMaterialColor,
} from "../utils/recyclingMaterials";
import { styles } from "../styles/screens/GeneralDonationsScreen.styles";

const GeneralDonationsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(SEMESTER_ROUTES.CURRENT_DONATION_STATS);
      setStats(response.data?.data ?? null);
    } catch (error) {
      console.error("[GeneralDonationsScreen] Error loading stats:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      }
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
  );

  const handleBack = () => goBackInDonationsStack(navigation);

  const handleRecentDonations = () => {
    navigation.navigate("RecentDonationsScreen");
  };

  const handleDonate = () => navigation.navigate("QRScannerScreen");

  const quantityByType = Object.fromEntries(
    (stats?.materials ?? []).map((item) => [item.materialType, item]),
  );

  const chartSegments = RECYCLING_MATERIALS.map(({ id }) => ({
    id,
    value: quantityByType[id]?.quantity ?? 0,
    color: getMaterialColor(id),
  }));

  const totalQuantity = stats?.totalQuantity ?? 0;

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

        <View style={styles.headerBlock}>
          <Text style={styles.title}>{t("GeneralDonations.title")}</Text>
          <Text style={styles.subtitle}>{t("GeneralDonations.subtitle")}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#29A66C" />
          </View>
        ) : connectionError ? (
          <ConnectionErrorCard onRetry={fetchStats} />
        ) : (
          <>
            <View style={styles.chartCard}>
              <View style={styles.chartWrapper}>
                <DonutChart segments={chartSegments} />
              </View>

              <View style={styles.legend}>
                {RECYCLING_MATERIALS.map(({ id, labelKey }) => {
                  const material = quantityByType[id];
                  const percentage = material?.percentage ?? 0;

                  return (
                    <View key={id} style={styles.legendRow}>
                      <Text style={styles.legendLabel}>{t(labelKey)}</Text>
                      <View style={styles.legendBarTrack}>
                        <View
                          style={[
                            styles.legendBarFill,
                            {
                              width: `${percentage}%`,
                              minWidth: percentage > 0 ? 4 : 0,
                              backgroundColor: getMaterialColor(id),
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.legendPercent}>{percentage}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <Text style={styles.summaryText}>
              {t("GeneralDonations.summaryPrefix")}
              <Text style={styles.summaryBold}>
                {t("GeneralDonations.summaryQuantity", {
                  count: totalQuantity,
                })}
              </Text>
            </Text>

            <TouchableOpacity
              style={styles.recentButton}
              onPress={handleRecentDonations}
              activeOpacity={0.8}
            >
              <Text style={styles.recentButtonText}>
                {t("GeneralDonations.recentButton")}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleDonate}
        activeOpacity={0.85}
        accessibilityLabel={t("Overview.emptyStateButton")}
      >
        <Ionicons name="add" size={28} color="#FDFEFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GeneralDonationsScreen;
