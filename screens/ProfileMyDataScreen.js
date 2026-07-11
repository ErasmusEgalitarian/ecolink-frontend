import React, { useCallback, useMemo, useState } from "react";
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
import { styles } from "../styles/screens/ProfileMyDataScreen.styles";

const formatCpf = (cpf) => {
  const digits = String(cpf || "").replace(/\D/g, "");
  if (digits.length !== 11) return cpf || "—";
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone || "—";
};

const formatDate = (value, locale) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ProfileDataRow = ({ label, value }) => (
  <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value ?? "—"}</Text>
  </View>
);

const ProfileMyDataScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(USER_ROUTES.ME);
      setProfile(response.data?.data ?? null);
    } catch (error) {
      console.error("[ProfileMyDataScreen] Error loading profile:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setProfile(null);
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

  const roleName = profile?.roleId?.name ?? "";
  const isCollector = canCollectPickups(roleName);
  const locale = i18n.language?.startsWith("en") ? "en-US" : "pt-BR";

  const roleLabel = useMemo(() => {
    if (!roleName) return "—";
    const key = `Profile.roles.${roleName}`;
    const translated = t(key);
    return translated === key ? roleName : translated;
  }, [roleName, t]);

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

    if (!profile) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t("Profile.myDataEmptyTitle")}</Text>
          <Text style={styles.emptyMessage}>{t("Profile.myDataEmptyMessage")}</Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <ProfileDataRow label={t("Profile.fields.name")} value={profile.username} />
        <ProfileDataRow label={t("Profile.fields.email")} value={profile.email} />
        <ProfileDataRow
          label={t("Profile.fields.phone")}
          value={formatPhone(profile.phone)}
        />
        <ProfileDataRow
          label={t("Profile.fields.cpf")}
          value={formatCpf(profile.cpf)}
        />
        <ProfileDataRow
          label={t("Profile.fields.address")}
          value={profile.address || t("Profile.notProvided")}
        />
        <ProfileDataRow label={t("Profile.fields.role")} value={roleLabel} />
        <ProfileDataRow
          label={t("Profile.fields.memberSince")}
          value={formatDate(profile.createdAt, locale)}
        />

        {isCollector ? (
          <ProfileDataRow
            label={t("Profile.fields.totalPickups")}
            value={String(profile.totalPickups ?? 0)}
          />
        ) : (
          <ProfileDataRow
            label={t("Profile.fields.wasteSaved")}
            value={t("Profile.wasteSavedValue", {
              amount: profile.wasteSaved ?? 0,
            })}
          />
        )}
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
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            accessibilityLabel={t("Profile.back")}
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{t("Profile.myData")}</Text>
        <Text style={styles.subtitle}>{t("Profile.myDataSubtitle")}</Text>

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileMyDataScreen;
