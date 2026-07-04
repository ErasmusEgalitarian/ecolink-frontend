import React, { useCallback } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import EcopointCard from "../components/EcopointCard";
import ConnectionErrorCard from "../components/ConnectionErrorCard";
import { useUserLocation } from "../hooks/useUserLocation";
import { useAvailableEcopoints } from "../hooks/useAvailableEcopoints";
import { styles } from "../styles/screens/AvailableEcopointsScreen.styles";

const AvailableEcopointsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    coords,
    loading: locationLoading,
    denied: locationDenied,
    unavailable: locationUnavailable,
    error: locationError,
    refresh: refreshLocation,
  } = useUserLocation();
  const { locations, loading, connectionError, fetchAvailable } =
    useAvailableEcopoints();

  const locationBlocked = locationDenied || locationUnavailable || locationError;

  useFocusEffect(
    useCallback(() => {
      if (coords) {
        fetchAvailable({ lat: coords.lat, lng: coords.lng });
      }
    }, [coords, fetchAvailable]),
  );

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate("Doações", { screen: "DashboardScreen" });
    }
  };

  const handleDonate = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate("Doações", { screen: "QRScannerScreen" });
      return;
    }
    navigation.navigate("QRScannerScreen");
  };

  const handleRetry = () => {
    if (coords) {
      fetchAvailable({ lat: coords.lat, lng: coords.lng });
    }
  };

  const handleLocationPress = (location) => {
    navigation.navigate("EcopointDetailScreen", {
      locationId: location._id,
    });
  };

  const handleHelp = () => {
    navigation.navigate("EcopointFaqScreen");
  };

  const handleEnableLocation = async () => {
    const result = await refreshLocation({ request: true });
    if (
      result &&
      !result.granted &&
      result.canAskAgain === false &&
      Platform.OS !== "web"
    ) {
      try {
        await Linking.openSettings();
      } catch (err) {
        console.error("Unable to open settings:", err);
      }
    }
  };

  const isLoading = locationLoading || loading;
  const nearest = locations[0];
  const others = locations.slice(1);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#29A66C" />
          <Text style={styles.loadingText}>{t("Ecopoints.loading")}</Text>
        </View>
      );
    }

    if (locationBlocked) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="navigate-outline" size={40} color="#29A66C" />
          </View>
          <Text style={styles.emptyTitle}>
            {t("Ecopoints.locationBlockedTitle")}
          </Text>
          <Text style={styles.emptySubtitle}>
            {locationUnavailable
              ? t("Ecopoints.locationUnavailableSubtitle")
              : t("Ecopoints.locationDeniedSubtitle")}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleEnableLocation}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyButtonText}>
              {t("Ecopoints.enableLocation")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (connectionError) {
      return (
        <ConnectionErrorCard
          onRetry={handleRetry}
          style={styles.connectionCard}
        />
      );
    }

    if (locations.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="location-outline" size={40} color="#29A66C" />
          </View>
          <Text style={styles.emptyTitle}>{t("Ecopoints.emptyTitle")}</Text>
          <Text style={styles.emptySubtitle}>
            {t("Ecopoints.emptySubtitle")}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleRetry}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyButtonText}>
              {t("Ecopoints.emptyButton")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("Ecopoints.nearestTitle")}
          </Text>
          <EcopointCard
            location={nearest}
            onPress={() => handleLocationPress(nearest)}
          />
        </View>

        {others.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("Ecopoints.othersTitle")}
            </Text>
            {others.map((location) => (
              <EcopointCard
                key={location._id}
                location={location}
                onPress={() => handleLocationPress(location)}
              />
            ))}
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
            accessibilityLabel={t("QRScanner.backButton")}
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleHelp}
            activeOpacity={0.8}
            accessibilityLabel={t("EcopointFaq.helpButton")}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{t("Ecopoints.title")}</Text>

        {renderContent()}
      </ScrollView>

      {/* CTA flutuante — Realizar doação */}
      <TouchableOpacity
        style={styles.donateButton}
        onPress={handleDonate}
        activeOpacity={0.85}
      >
        <Text style={styles.donateButtonText}>{t("Ecopoints.donate")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AvailableEcopointsScreen;
