import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Image,
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

import ConnectionErrorCard from "../components/ConnectionErrorCard";
import LocationEcopointItem from "../components/LocationEcopointItem";
import { useLocationDetail } from "../hooks/useLocationDetail";
import { returnToScreen } from "../utils/donationsNavigation";
import { getStatusMeta } from "../utils/ecopoints";
import { styles } from "../styles/screens/EcopointDetailScreen.styles";

const EcopointDetailScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const locationId = route.params?.locationId;
  const { location, loading, connectionError, notFound, fetchLocation } =
    useLocationDetail();

  useFocusEffect(
    useCallback(() => {
      if (locationId) {
        fetchLocation(locationId);
      }
    }, [locationId, fetchLocation]),
  );

  const handleBack = () => {
    returnToScreen(navigation, "AvailableEcopointsScreen");
  };

  const handleRetry = () => {
    if (locationId) {
      fetchLocation(locationId);
    }
  };

  const handleOpenRoute = () => {
    const coords = location?.coordinates?.coordinates;
    if (!coords || coords.length < 2) {
      return;
    }

    const [lng, lat] = coords;
    const label = encodeURIComponent(location.name || "Ecoponto");
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });

    Linking.openURL(url).catch((err) => {
      console.error("Unable to open maps:", err);
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#29A66C" />
          <Text style={styles.loadingText}>{t("EcopointDetail.loading")}</Text>
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

    if (notFound || !location) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.emptyTitle}>{t("EcopointDetail.notFound")}</Text>
        </View>
      );
    }

    const statusMeta = getStatusMeta(location.status, t);
    const isActive = location.status === "open";
    const spaceType = location.isExtern
      ? t("EcopointDetail.spaceExternal")
      : t("EcopointDetail.spaceInternal");
    const hasImage = Boolean(location.imageUrl);

    return (
      <>
        <Text style={styles.title}>{location.name}</Text>
        <View style={styles.divider} />

        <View style={styles.imageWrapper}>
          {hasImage ? (
            <Image
              source={{ uri: location.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={48} color="#809CAD" />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.routeButton}
          onPress={handleOpenRoute}
          activeOpacity={0.85}
        >
          <Text style={styles.routeButtonText}>
            {t("EcopointDetail.route")}
          </Text>
        </TouchableOpacity>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {t("EcopointDetail.addressLabel")}
            </Text>
            <Text style={styles.detailValue}>{location.address}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {t("EcopointDetail.spaceLabel")}
            </Text>
            <Text style={styles.detailValue}>{spaceType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {t("EcopointDetail.hoursLabel")}
            </Text>
            <Text style={styles.detailValue}>
              {location.operatingHours || t("EcopointDetail.hoursUnavailable")}
            </Text>
          </View>

          <View style={styles.ecopointsSection}>
            <Text style={styles.detailLabel}>
              {t("EcopointDetail.ecopointsLabel")}
            </Text>
            <View style={styles.ecopointsList}>
              {(location.ecopoints || []).map((ecopoint) => (
                <LocationEcopointItem
                  key={ecopoint._id}
                  ecopoint={ecopoint}
                />
              ))}
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {t("EcopointDetail.activeLabel")}
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: isActive ? statusMeta.color : "#D62B25" },
              ]}
            >
              {isActive
                ? t("EcopointDetail.activeYes")
                : t("EcopointDetail.activeNo")}
            </Text>
          </View>
        </View>
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
    </SafeAreaView>
  );
};

export default EcopointDetailScreen;
