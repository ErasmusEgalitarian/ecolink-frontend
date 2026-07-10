import React, { useMemo, useState } from "react";
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
import PickupFilterChips, {
  MY_PICKUP_FILTERS,
} from "../components/pickup/PickupFilterChips";
import { useAcceptedPickups } from "../hooks/usePickups";
import { getPickupId } from "../utils/pickupDisplay";
import { goBackInDonationsStack } from "../utils/donationsNavigation";
import { styles } from "../styles/screens/CollectorPickupsScreen.styles";

const STATUS_SORT_PRIORITY = {
  accepted: 0,
  completed: 1,
  cancelled: 2,
};

const sortMyPickups = (pickups) =>
  [...pickups].sort((left, right) => {
    const leftPriority =
      STATUS_SORT_PRIORITY[left.pickupStatus] ?? Number.MAX_SAFE_INTEGER;
    const rightPriority =
      STATUS_SORT_PRIORITY[right.pickupStatus] ?? Number.MAX_SAFE_INTEGER;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    const leftDate = new Date(
      left.completedAt || left.confirmedAt || left.createdAt || 0,
    ).getTime();
    const rightDate = new Date(
      right.completedAt || right.confirmedAt || right.createdAt || 0,
    ).getTime();

    return rightDate - leftDate;
  });

const CollectorPickupsScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const initialFilter = route?.params?.initialFilter;
  const [selectedFilter, setSelectedFilter] = useState(
    MY_PICKUP_FILTERS.includes(initialFilter) ? initialFilter : "all",
  );

  const { pickups, loading, connectionError, refresh } = useAcceptedPickups();

  const filterCounts = useMemo(() => {
    const counts = {
      all: pickups.length,
      accepted: 0,
      completed: 0,
      cancelled: 0,
    };

    pickups.forEach((pickup) => {
      if (counts[pickup.pickupStatus] != null) {
        counts[pickup.pickupStatus] += 1;
      }
    });

    return counts;
  }, [pickups]);

  const filteredPickups = useMemo(() => {
    const sorted = sortMyPickups(pickups);

    if (selectedFilter === "all") {
      return sorted;
    }

    return sorted.filter((pickup) => pickup.pickupStatus === selectedFilter);
  }, [pickups, selectedFilter]);

  const handleBack = () => goBackInDonationsStack(navigation);

  const handleOpenPickup = (pickup) => {
    navigation.navigate("CollectorPickupScreen", {
      pickupId: getPickupId(pickup),
    });
  };

  const getEmptyCopy = () => {
    if (selectedFilter === "accepted") {
      return {
        title: t("Collector.emptyAcceptedTitle"),
        message: t("Collector.emptyAcceptedMessage"),
      };
    }

    if (selectedFilter === "completed") {
      return {
        title: t("Collector.emptyCompletedTitle"),
        message: t("Collector.emptyCompletedMessage"),
      };
    }

    if (selectedFilter === "cancelled") {
      return {
        title: t("Collector.emptyCancelledTitle"),
        message: t("Collector.emptyCancelledMessage"),
      };
    }

    return {
      title: t("Collector.emptyMyPickupsTitle"),
      message: t("Collector.emptyMyPickupsMessage"),
    };
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

    if (filteredPickups.length === 0) {
      const emptyCopy = getEmptyCopy();

      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>{emptyCopy.title}</Text>
          <Text style={styles.emptyMessage}>{emptyCopy.message}</Text>
        </View>
      );
    }

    return (
      <View style={styles.list}>
        {filteredPickups.map((pickup) => (
          <PickupCard
            key={getPickupId(pickup)}
            pickup={pickup}
            onPress={handleOpenPickup}
            showActionHint={pickup.pickupStatus === "accepted"}
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
          <Text style={styles.title}>{t("Collector.myPickupsTitle")}</Text>
          <Text style={styles.subtitle}>{t("Collector.myPickupsSubtitle")}</Text>
        </View>

        <PickupFilterChips
          selectedFilter={selectedFilter}
          onSelect={setSelectedFilter}
          counts={filterCounts}
        />

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CollectorPickupsScreen;
