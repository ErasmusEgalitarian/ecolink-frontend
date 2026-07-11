import React from "react";
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

import ConnectionErrorCard from "../components/ConnectionErrorCard";
import PickupCard from "../components/pickup/PickupCard";
import { usePendingPickups } from "../hooks/usePickups";
import { getPickupId } from "../utils/pickupDisplay";
import { goBackInDonationsStack } from "../utils/donationsNavigation";
import { styles } from "../styles/screens/PendingPickupsScreen.styles";

const PendingPickupsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { pickups, loading, connectionError, refresh } = usePendingPickups();

  const handleBack = () => goBackInDonationsStack(navigation);

  const handleOpenPickup = (pickup) => {
    navigation.navigate("CollectorPickupScreen", {
      pickupId: getPickupId(pickup),
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
      return <ConnectionErrorCard onRetry={refresh} />;
    }

    if (pickups.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>{t("Collector.emptyPendingTitle")}</Text>
          <Text style={styles.emptyMessage}>
            {t("Collector.emptyPendingMessage")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.list}>
        {pickups.map((pickup) => (
          <PickupCard
            key={getPickupId(pickup)}
            pickup={pickup}
            onPress={handleOpenPickup}
            showActionHint
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

        <View>
          <Text style={styles.title}>{t("Collector.pendingScreenTitle")}</Text>
          <Text style={styles.subtitle}>{t("Collector.pendingScreenSubtitle")}</Text>
        </View>

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PendingPickupsScreen;
