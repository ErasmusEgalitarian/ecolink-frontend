import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import ConnectionErrorCard from "../components/ConnectionErrorCard";
import ProfileAvatarUploader from "../components/profile/ProfileAvatarUploader";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import { api, USER_ROUTES, isApiConnectionError } from "../config/api";
import { uploadProfileImage } from "../utils/profileImageUpload";
import { canCollectPickups } from "../utils/collectorPermissions";
import {
  formatCpfDisplay,
  formatPhone,
  stripDigits,
} from "../utils/brazilianInputMasks";
import { goBackInProfileStack } from "../utils/profileNavigation";
import { styles } from "../styles/screens/ProfileMyDataScreen.styles";

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

const ProfileFormField = ({ label, value, onChangeText, placeholder, keyboardType }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.fieldInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      autoCapitalize="sentences"
    />
  </View>
);

const ProfileMyDataScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const applyProfile = useCallback((data) => {
    setProfile(data);
    setUsername(data?.username ?? "");
    setPhone(stripDigits(data?.phone).slice(0, 11));
    setAddress(data?.address ?? "");
    setAvatarUrl(data?.avatarUrl || null);
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(USER_ROUTES.ME);
      applyProfile(response.data?.data ?? null);
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
  }, [applyProfile]);

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

  const handleSave = async () => {
    if (!username.trim()) {
      setErrorMessage(t("Profile.validation.usernameRequired"));
      setShowErrorModal(true);
      return;
    }

    if (phone && !/^\d{10,11}$/.test(phone)) {
      setErrorMessage(t("Profile.validation.phoneInvalid"));
      setShowErrorModal(true);
      return;
    }

    setSaving(true);

    try {
      let savedProfile = null;

      if (pendingAvatarFile) {
        savedProfile = await uploadProfileImage(pendingAvatarFile);
      }

      const response = await api.put(USER_ROUTES.UPDATE_ME, {
        username: username.trim(),
        phone,
        address: address.trim(),
      });

      const updatedProfile = {
        ...(response.data?.data ?? {}),
        ...(savedProfile ?? {}),
        avatarUrl: savedProfile?.avatarUrl || response.data?.data?.avatarUrl || null,
      };

      applyProfile(updatedProfile);

      if (updatedProfile?.username) {
        await AsyncStorage.setItem("userName", updatedProfile.username);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("[ProfileMyDataScreen] Error saving profile:", error);
      setErrorMessage(error?.message || t("Profile.saveError"));
      setShowErrorModal(true);
    } finally {
      setSaving(false);
    }
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

    if (!profile) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t("Profile.myDataEmptyTitle")}</Text>
          <Text style={styles.emptyMessage}>{t("Profile.myDataEmptyMessage")}</Text>
        </View>
      );
    }

    return (
      <>
        <ProfileAvatarUploader
          avatarUrl={avatarUrl}
          previewUri={pendingAvatarPreview}
          disabled={saving}
          onImageSelected={(file, preview) => {
            setPendingAvatarFile(file);
            setPendingAvatarPreview(preview);
          }}
        />

        <View style={styles.card}>
          <ProfileFormField
            label={t("Profile.fields.name")}
            value={username}
            onChangeText={setUsername}
            placeholder={t("Profile.placeholders.name")}
          />
          <ProfileDataRow label={t("Profile.fields.email")} value={profile.email} />
          <ProfileFormField
            label={t("Profile.fields.phone")}
            value={formatPhone(phone)}
            onChangeText={(value) => setPhone(stripDigits(value).slice(0, 11))}
            placeholder={t("Profile.placeholders.phone")}
            keyboardType="phone-pad"
          />
          <ProfileDataRow
            label={t("Profile.fields.cpf")}
            value={formatCpfDisplay(profile.cpf)}
          />
          <ProfileFormField
            label={t("Profile.fields.address")}
            value={address}
            onChangeText={setAddress}
            placeholder={t("Profile.placeholders.address")}
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

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>{t("Profile.saveChanges")}</Text>
          )}
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

        <Text style={styles.title}>{t("Profile.myData")}</Text>
        <Text style={styles.subtitle}>{t("Profile.myDataEditSubtitle")}</Text>

        {renderContent()}
      </ScrollView>

      <SuccessModal
        visible={showSuccessModal}
        title={t("Profile.saveSuccessTitle")}
        message={t("Profile.saveSuccessMessage")}
        buttonText={t("Profile.ok")}
        onConfirm={() => setShowSuccessModal(false)}
      />

      <ErrorModal
        visible={showErrorModal}
        title={t("Profile.saveErrorTitle")}
        message={errorMessage}
        onConfirm={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
};

export default ProfileMyDataScreen;
