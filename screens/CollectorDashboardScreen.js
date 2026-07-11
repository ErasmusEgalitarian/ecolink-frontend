import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import ConnectionErrorCard from "../components/ConnectionErrorCard";
import PickupCard from "../components/pickup/PickupCard";
import { useAcceptedPickups, usePendingPickups } from "../hooks/usePickups";
import { getPickupId } from "../utils/pickupDisplay";
import { styles } from "../styles/screens/CollectorDashboardScreen.styles";

const CollectorDashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState("");

  const {
    pickups: pendingPickups,
    loading: pendingLoading,
    connectionError: pendingConnectionError,
    refresh: refreshPending,
  } = usePendingPickups();

  const {
    pickups: acceptedPickups,
    loading: acceptedLoading,
    connectionError: acceptedConnectionError,
    refresh: refreshAccepted,
  } = useAcceptedPickups();

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const name = await AsyncStorage.getItem("userName");
        setUserName(name ? name.split(" ")[0] : "");
      };

      loadUser();
    }, []),
  );

  const loading = pendingLoading || acceptedLoading;
  const connectionError = pendingConnectionError || acceptedConnectionError;

  const activePickups = useMemo(
    () =>
      acceptedPickups.filter((pickup) => pickup.pickupStatus === "accepted"),
    [acceptedPickups],
  );

  const pendingPreview = pendingPickups.slice(0, 3);

  const handleOpenPickup = (pickup) => {
    navigation.navigate("CollectorPickupScreen", {
      pickupId: getPickupId(pickup),
    });
  };

  const handleViewAllPending = () => {
    navigation.navigate("PendingPickupsScreen");
  };

  const handleViewMyPickups = () => {
    navigation.navigate("CollectorPickupsScreen");
  };

  const handleOpenEcopoints = () => {
    navigation.navigate("AvailableEcopointsScreen", { monitorMode: true });
  };

  const handleRetry = () => {
    refreshPending();
    refreshAccepted();
  };

  const renderPendingSection = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29A66C" />
        </View>
      );
    }

    if (connectionError) {
      return <ConnectionErrorCard onRetry={handleRetry} />;
    }

    if (pendingPickups.length === 0) {
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
        {pendingPreview.map((pickup) => (
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
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerGreeting}>{t("Collector.greeting")}</Text>
        <Text style={styles.headerName}>{userName}!</Text>
        <Text style={styles.headerSubtitle}>{t("Collector.subtitle")}</Text>
      </View>

      {activePickups.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activePickups.length === 1
              ? t("Collector.activePickupTitle")
              : t("Collector.activePickupsTitle", { count: activePickups.length })}
          </Text>
          <View style={styles.list}>
            {activePickups.map((pickup) => (
              <PickupCard
                key={getPickupId(pickup)}
                pickup={pickup}
                onPress={handleOpenPickup}
                showActionHint
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t("Collector.pendingTitle")}</Text>
          {pendingPickups.length > 3 ? (
            <TouchableOpacity onPress={handleViewAllPending} activeOpacity={0.8}>
              <Text style={styles.sectionAction}>{t("Collector.viewAll")}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {renderPendingSection()}
      </View>

      <View style={styles.cardsRow}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={handleOpenEcopoints}
          activeOpacity={0.8}
        >
          <View style={styles.quickCardIconContainer}>
            <Ionicons name="location-outline" size={22} color="#1A7048" />
          </View>
          <Text style={styles.quickCardText}>{t("Collector.monitorEcopoints")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={handleViewMyPickups}
          activeOpacity={0.8}
        >
          <View style={styles.quickCardIconContainer}>
            <Ionicons name="list-outline" size={22} color="#1A7048" />
          </View>
          <Text style={styles.quickCardText}>{t("Collector.allPickups")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CollectorDashboardScreen;
