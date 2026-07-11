import React, { useState } from "react";
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

import AppConfirmationModal from "../components/AppConfirmationModal";
import ErrorModal from "../components/ErrorModal";
import SuccessModal from "../components/SuccessModal";
import { api, USER_ROUTES } from "../config/api";
import { clearAuthStorage } from "../utils/authToken";
import { goBackInProfileStack } from "../utils/profileNavigation";
import { styles } from "../styles/screens/ProfileDeleteAccountScreen.styles";

const ProfileDeleteAccountConfirmScreen = ({ navigation, route, onLogout }) => {
  const { t } = useTranslation();
  const isCollector = route?.params?.isCollector ?? false;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const consequenceKey = isCollector
    ? "Profile.deleteAccountFinalPickups"
    : "Profile.deleteAccountFinalDonations";

  const performDeleteAccount = async () => {
    try {
      setDeleting(true);
      setShowConfirmModal(false);

      await api.delete(USER_ROUTES.DELETE_ME);
      await clearAuthStorage();

      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        "[ProfileDeleteAccountConfirmScreen] Delete account error:",
        error,
      );
      setErrorMessage(
        error?.response?.data?.message || t("Profile.deleteAccountErrorMessage"),
      );
      setShowErrorModal(true);
    } finally {
      setDeleting(false);
    }
  };

  const handleSuccessClose = async () => {
    setShowSuccessModal(false);

    if (onLogout) {
      await onLogout();
    }
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
            disabled={deleting}
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{t("Profile.deleteAccountFinalTitle")}</Text>

        <View style={styles.finalCard}>
          <View style={styles.finalIconContainer}>
            <Ionicons name="warning" size={40} color="#DC2626" />
          </View>
          <Text style={styles.finalMessage}>
            {t("Profile.deleteAccountFinalMessage")}
          </Text>
          <Text style={styles.finalConsequence}>{t(consequenceKey)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
          onPress={() => setShowConfirmModal(true)}
          activeOpacity={0.8}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>
                {t("Profile.deleteAccountConfirmButton")}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => goBackInProfileStack(navigation)}
          activeOpacity={0.8}
          disabled={deleting}
        >
          <Text style={styles.cancelButtonText}>{t("Profile.cancel")}</Text>
        </TouchableOpacity>
      </ScrollView>

      <AppConfirmationModal
        visible={showConfirmModal}
        title={t("Profile.deleteAccountConfirmTitle")}
        message={t("Profile.deleteAccountConfirmMessage")}
        cancelText={t("Profile.cancel")}
        confirmText={t("Profile.deleteAccountConfirmButton")}
        variant="destructive"
        icon="trash-outline"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={performDeleteAccount}
      />

      <SuccessModal
        visible={showSuccessModal}
        title={t("Profile.deleteAccountSuccessTitle")}
        message={t("Profile.deleteAccountSuccessMessage")}
        buttonText={t("Profile.ok")}
        onConfirm={handleSuccessClose}
      />

      <ErrorModal
        visible={showErrorModal}
        title={t("Profile.deleteAccountErrorTitle")}
        message={errorMessage}
        onConfirm={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
};

export default ProfileDeleteAccountConfirmScreen;
