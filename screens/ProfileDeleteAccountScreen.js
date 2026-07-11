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
import { api, USER_ROUTES, isApiConnectionError } from "../config/api";
import { canCollectPickups } from "../utils/collectorPermissions";
import { goBackInProfileStack } from "../utils/profileNavigation";
import { styles } from "../styles/screens/ProfileDeleteAccountScreen.styles";

const COLLECTOR_WARNING_ITEMS = [
  "Profile.deleteAccountWarningProfile",
  "Profile.deleteAccountWarningPickups",
  "Profile.deleteAccountWarningIrreversible",
];

const DONOR_WARNING_ITEMS = [
  "Profile.deleteAccountWarningProfile",
  "Profile.deleteAccountWarningDonations",
  "Profile.deleteAccountWarningIrreversible",
];

const ProfileDeleteAccountScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [roleName, setRoleName] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(USER_ROUTES.ME);
      setRoleName(response.data?.data?.roleId?.name ?? "");
    } catch (error) {
      console.error("[ProfileDeleteAccountScreen] Error loading profile:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile]),
  );

  const isCollector = canCollectPickups(roleName);
  const warningItems = isCollector
    ? COLLECTOR_WARNING_ITEMS
    : DONOR_WARNING_ITEMS;

  const handleContinue = () => {
    navigation.navigate("ProfileDeleteAccountConfirmScreen", {
      isCollector,
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
      return <ConnectionErrorCard onRetry={fetchProfile} />;
    }

    return (
      <>
        <Text style={styles.subtitle}>{t("Profile.deleteAccountSubtitle")}</Text>

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>
            {t("Profile.deleteAccountWarningTitle")}
          </Text>
          <Text style={styles.warningText}>
            {t("Profile.deleteAccountWarningIntro")}
          </Text>

          <View style={styles.bulletList}>
            {warningItems.map((itemKey) => (
              <View key={itemKey} style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{t(itemKey)}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>
            {t("Profile.deleteAccountContinue")}
          </Text>
        </TouchableOpacity>
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
            onPress={() => goBackInProfileStack(navigation)}
            activeOpacity={0.8}
            accessibilityLabel={t("Profile.back")}
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{t("Profile.deleteAccount")}</Text>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDeleteAccountScreen;
