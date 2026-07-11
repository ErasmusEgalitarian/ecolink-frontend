import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import AppConfirmationModal from "../components/AppConfirmationModal";
import ConnectionErrorCard from "../components/ConnectionErrorCard";
import ErrorModal from "../components/ErrorModal";
import PickupActionBar from "../components/pickup/PickupActionBar";
import PickupDonationsList from "../components/pickup/PickupDonationsList";
import PickupStatusBadge from "../components/pickup/PickupStatusBadge";
import PickupTimeline from "../components/pickup/PickupTimeline";
import {
  usePickupActions,
  usePickupDetail,
} from "../hooks/usePickups";
import { api, USER_ROUTES } from "../config/api";
import { goBackInDonationsStack } from "../utils/donationsNavigation";
import {
  getPickupEcopointLabel,
  getPickupEcopointStatus,
  getPickupLocation,
  getPickupLocationName,
  isPickupActiveForUser,
} from "../utils/pickupDisplay";
import { getStatusMeta } from "../utils/ecopoints";
import { styles } from "../styles/screens/CollectorPickupScreen.styles";

const CollectorPickupScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const pickupId = route?.params?.pickupId;
  const [userId, setUserId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    pickup,
    loading,
    connectionError,
    notFound,
    refresh,
  } = usePickupDetail(pickupId);

  const {
    submitting,
    acceptPickup,
    completePickup,
    cancelPickup,
  } = usePickupActions();

  useFocusEffect(
    useCallback(() => {
      const loadUserId = async () => {
        try {
          const response = await api.get(USER_ROUTES.ME);
          const profile = response.data?.data;
          const id = profile?._id?.toString?.() || profile?.id;
          if (id) {
            setUserId(String(id));
            return;
          }
        } catch (error) {
          console.error("[CollectorPickupScreen] Error loading user id:", error);
        }

        const cachedId = await AsyncStorage.getItem("userId");
        setUserId(cachedId);
      };

      loadUserId();
    }, []),
  );

  const canManage = useMemo(() => {
    if (!pickup) {
      return false;
    }

    if (pickup.pickupStatus === "pending") {
      return true;
    }

    if (pickup.pickupStatus === "accepted") {
      return isPickupActiveForUser(pickup, userId);
    }

    return false;
  }, [pickup, userId]);

  const handleBack = () => goBackInDonationsStack(navigation);

  const handleOpenRoute = () => {
    const location = getPickupLocation(pickup);
    const coords = location?.coordinates?.coordinates;

    if (!coords || coords.length < 2) {
      return;
    }

    const [lng, lat] = coords;
    const label = encodeURIComponent(getPickupLocationName(pickup, t));
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });

    Linking.openURL(url).catch((err) => {
      console.error("[CollectorPickupScreen] Unable to open maps:", err);
    });
  };

  const handleAccept = async () => {
    try {
      await acceptPickup(pickupId);
      await refresh();
    } catch (error) {
      setErrorMessage(error?.message || t("Collector.errorGeneric"));
    }
  };

  const executeComplete = async () => {
    setConfirmAction(null);

    try {
      await completePickup(pickupId);
      await refresh();
      navigation.navigate("DashboardScreen");
    } catch (error) {
      setErrorMessage(error?.message || t("Collector.errorGeneric"));
    }
  };

  const executeCancel = async () => {
    setConfirmAction(null);

    try {
      await cancelPickup(pickupId);
      await refresh();
      navigation.navigate("DashboardScreen");
    } catch (error) {
      setErrorMessage(error?.message || t("Collector.errorGeneric"));
    }
  };

  const handleComplete = () => {
    setConfirmAction("complete");
  };

  const handleCancel = () => {
    setConfirmAction("cancel");
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

    if (notFound || !pickup) {
      return (
        <View style={styles.completedBanner}>
          <Text style={styles.completedBannerText}>{t("Collector.notFound")}</Text>
        </View>
      );
    }

    const location = getPickupLocation(pickup);
    const ecopointStatus = getPickupEcopointStatus(pickup);
    const ecopointStatusMeta = ecopointStatus
      ? getStatusMeta(ecopointStatus, t)
      : null;

    return (
      <>
        <View style={styles.headerBlock}>
          <Text style={styles.locationName}>
            {getPickupLocationName(pickup, t)}
          </Text>
          <Text style={styles.ecopointLabel}>
            {getPickupEcopointLabel(pickup, t)}
          </Text>
          {location?.address ? (
            <Text style={styles.address}>{location.address}</Text>
          ) : null}
          <View style={styles.statusRow}>
            <PickupStatusBadge status={pickup.pickupStatus} />
            {ecopointStatusMeta ? (
              <Text
                style={[styles.ecopointStatus, { color: ecopointStatusMeta.color }]}
              >
                {t("Collector.ecopointStatus", { status: ecopointStatusMeta.label })}
              </Text>
            ) : null}
          </View>
        </View>

        {pickup.pickupStatus === "completed" ? (
          <View style={styles.completedBanner}>
            <Text style={styles.completedBannerText}>
              {t("Collector.completedMessage")}
            </Text>
          </View>
        ) : null}

        {pickup.pickupStatus === "cancelled" ? (
          <View style={styles.cancelledBanner}>
            <Text style={styles.cancelledBannerText}>
              {t("Collector.cancelledDonationsNotice")}
            </Text>
          </View>
        ) : null}

        <PickupTimeline pickup={pickup} />

        <PickupDonationsList
          donations={pickup.donations ?? []}
          titleOverride={
            pickup.pickupStatus === "cancelled"
              ? t("Collector.cancelledDonationsTitle")
              : undefined
          }
        />

        <PickupActionBar
          pickupStatus={pickup.pickupStatus}
          canManage={canManage}
          submitting={submitting}
          onAccept={handleAccept}
          onComplete={handleComplete}
          onCancel={handleCancel}
          onOpenRoute={location?.coordinates ? handleOpenRoute : null}
        />
      </>
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

        {renderContent()}
      </ScrollView>

      <AppConfirmationModal
        visible={confirmAction === "complete"}
        title={t("Collector.completeConfirmTitle")}
        message={t("Collector.completeConfirmMessage")}
        cancelText={t("Collector.cancelAction")}
        confirmText={t("Collector.actions.complete")}
        onCancel={() => setConfirmAction(null)}
        onConfirm={executeComplete}
        icon="checkmark-circle-outline"
      />

      <AppConfirmationModal
        visible={confirmAction === "cancel"}
        title={t("Collector.cancelConfirmTitle")}
        message={t("Collector.cancelConfirmMessage")}
        cancelText={t("Collector.cancelAction")}
        confirmText={t("Collector.actions.cancel")}
        onCancel={() => setConfirmAction(null)}
        onConfirm={executeCancel}
        variant="destructive"
        icon="close-circle-outline"
      />

      <ErrorModal
        visible={Boolean(errorMessage)}
        title={t("Collector.errorTitle")}
        message={errorMessage}
        onConfirm={() => setErrorMessage("")}
      />
    </SafeAreaView>
  );
};

export default CollectorPickupScreen;
