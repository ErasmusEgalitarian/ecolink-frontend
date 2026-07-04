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
import AsyncStorage from "@react-native-async-storage/async-storage";

import ConnectionErrorCard from "../components/ConnectionErrorCard";
import RecentDonationCard from "../components/RecentDonationCard";
import { api, DONATION_ROUTES, isApiConnectionError } from "../config/api";
import { goBackInDonationsStack } from "../utils/donationsNavigation";
import { styles } from "../styles/screens/RecentDonationsScreen.styles";

const RECENT_DONATIONS_LIMIT = 50;

const RecentDonationsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setDonations([]);
        return;
      }

      const response = await api.get(DONATION_ROUTES.MY, {
        params: { page: 1, limit: RECENT_DONATIONS_LIMIT },
      });
      setDonations(response.data?.data ?? []);
    } catch (error) {
      console.error("[RecentDonationsScreen] Error loading donations:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setDonations([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDonations();
    }, [fetchDonations]),
  );

  const handleBack = () => goBackInDonationsStack(navigation);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29A66C" />
        </View>
      );
    }

    if (connectionError) {
      return <ConnectionErrorCard onRetry={fetchDonations} />;
    }

    if (donations.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t("RecentDonations.emptyTitle")}</Text>
          <Text style={styles.emptyMessage}>
            {t("RecentDonations.emptyMessage")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.list}>
        {donations.map((donation) => (
          <RecentDonationCard
            key={donation._id}
            donation={donation}
          />
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

        <Text style={styles.title}>{t("RecentDonations.title")}</Text>

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecentDonationsScreen;
