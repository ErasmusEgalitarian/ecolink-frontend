import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppConfirmationModal from "../components/AppConfirmationModal";
import { clearAuthStorage } from "../utils/authToken";
import { LANGUAGE_STORAGE_KEY, normalizeLanguage } from "../utils/language";
import { styles } from "../styles/screens/ProfileScreen.styles";

const MENU_ITEMS = [
  {
    id: "myData",
    icon: "person-outline",
    labelKey: "Profile.myData",
    screen: "ProfileMyDataScreen",
  },
  {
    id: "history",
    icon: "time-outline",
    labelKey: "Profile.donationHistory",
    screen: "DonationHistoryScreen",
  },
  {
    id: "about",
    icon: "information-circle-outline",
    labelKey: "Profile.aboutProject",
    screen: "DonationsFaqScreen",
  },
  {
    id: "password",
    icon: "lock-closed-outline",
    labelKey: "Profile.changePassword",
    screen: "ProfileChangePasswordScreen",
  },
  {
    id: "deleteAccount",
    icon: "trash-outline",
    labelKey: "Profile.deleteAccount",
    screen: "ProfileDeleteAccountScreen",
    danger: true,
  },
];

const ProfileScreen = ({ navigation, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState("Avatar Name");
  const [userEmail, setUserEmail] = useState("avatar@email.com");
  const [currentLanguage, setCurrentLanguage] = useState(
    normalizeLanguage(i18n.language),
  );

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      setCurrentLanguage(normalizeLanguage(i18n.language));
    }, [i18n.language]),
  );

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("userName");
      const email = await AsyncStorage.getItem("userEmail");

      if (name) setUserName(name);
      if (email) setUserEmail(email);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const handleToggleLanguage = async () => {
    const next = currentLanguage === "pt" ? "en" : "pt";
    await i18n.changeLanguage(next);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    setCurrentLanguage(next);
  };

  const performLogout = async () => {
    try {
      setShowLogoutModal(false);
      await clearAuthStorage();

      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderMenuItem = ({ id, icon, labelKey, screen, danger = false }) => (
    <TouchableOpacity
      key={id}
      style={[styles.menuItem, danger && styles.menuItemDanger]}
      onPress={() => handleNavigate(screen)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={20}
        color={danger ? "#E63946" : "#52B788"}
        style={styles.menuIcon}
      />
      <Text style={[styles.menuText, danger && styles.menuTextDanger]}>
        {t(labelKey)}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={danger ? "#FCA5A5" : "#D1D5DB"}
      />
    </TouchableOpacity>
  );

  const renderLanguageToggle = () => (
    <TouchableOpacity
      style={styles.languageOption}
      onPress={handleToggleLanguage}
      activeOpacity={0.7}
    >
      <Ionicons
        name="language-outline"
        size={20}
        color="#52B788"
        style={styles.menuIcon}
      />
      <Text style={styles.menuText}>{t("Profile.changeLanguage")}</Text>
      <View style={styles.languageBadge}>
        <Text style={styles.languageBadgeText}>
          {currentLanguage.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("Profile.title")}</Text>
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={32} color="#52B788" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {renderMenuItem(MENU_ITEMS[0])}
          {renderLanguageToggle()}
          {MENU_ITEMS.slice(1).map(renderMenuItem)}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#E63946" />
          <Text style={styles.logoutText}>{t("Profile.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>

      <AppConfirmationModal
        visible={showLogoutModal}
        title={t("Profile.logoutTitle")}
        message={t("Profile.logoutMessage")}
        cancelText={t("Profile.cancel")}
        confirmText={t("Profile.logoutConfirm")}
        variant="destructive"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={performLogout}
      />
    </View>
  );
};

export default ProfileScreen;
