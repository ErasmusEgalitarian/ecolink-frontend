import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OverviewPickupCards from "../components/OverviewPickupCards";
import OverviewDonationCards from "../components/OverviewDonationCards";
import WelcomeModal from "../components/WelcomeModal";
import { debugAdminStatus } from "../utils/debugAdmin";
import { DONATION_ENDPOINTS } from "../config/api";
import { styles } from "../styles/screens/OverviewScreen.styles";

const ScheduledPickUpScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("myDonations");
  const [pickupData, setPickupData] = useState([]);
  const [donationData, setDonationData] = useState([]);
  const [allDonationsData, setAllDonationsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Check if user is admin
  useEffect(() => {
    checkUserRole();
    checkAndShowWelcomeModal();
  }, []);

  // Fetch user donations
  useEffect(() => {
    if (selectedTab === "myDonations") {
      fetchUserDonations();
    } else if (selectedTab === "allDonations" && isAdmin) {
      fetchAllDonations();
    }
  }, [selectedTab, isAdmin]);

  // Recarregar doações quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 OverviewScreen: Recarregando doações ao receber foco");
      if (selectedTab === "myDonations") {
        fetchUserDonations();
      } else if (selectedTab === "allDonations" && isAdmin) {
        fetchAllDonations();
      }
    }, [selectedTab, isAdmin])
  );

  // Check if user is admin
  // Admin users have access to ALL functionalities:
  // - "My Donations" (normal user functionality)
  // - "All Donations" (admin-only functionality - shows all system donations)
  const checkUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem("userRole");
      console.log("🔍 [OverviewScreen] User role from AsyncStorage:", role);
      const adminStatus = role === "Admin";
      console.log("🔍 [OverviewScreen] Is Admin?", adminStatus);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
    }
  };

  // Verificar se deve mostrar o modal de boas-vindas (uma vez por dia)
  const checkAndShowWelcomeModal = async () => {
    try {
      const lastShownDate = await AsyncStorage.getItem("lastWelcomeModalDate");
      const today = new Date().toDateString();

      console.log("📅 Last shown date:", lastShownDate);
      console.log("📅 Today:", today);

      if (lastShownDate !== today) {
        // Mostrar o modal após um pequeno delay para melhor UX
        setTimeout(() => {
          setShowWelcomeModal(true);
        }, 500);

        // Salvar a data de hoje
        await AsyncStorage.setItem("lastWelcomeModalDate", today);
      }
    } catch (error) {
      console.error("Error checking welcome modal date:", error);
    }
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  const fetchUserDonations = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.warn("Token not found");
        setShowEmptyState(true);
        return;
      }

      const response = await fetch(`${DONATION_ENDPOINTS.LIST}/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const donations = result.data || [];

      setDonationData(donations);
      setShowEmptyState(donations.length === 0);
    } catch (error) {
      console.error("Error fetching donations:", error);
      setDonationData([]);
      setShowEmptyState(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDonations = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.warn("Token not found");
        setShowEmptyState(true);
        return;
      }

      const response = await fetch(DONATION_ENDPOINTS.LIST, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const donations = result.data || [];

      setAllDonationsData(donations);
      setShowEmptyState(donations.length === 0);
    } catch (error) {
      console.error("Error fetching all donations:", error);
      setAllDonationsData([]);
      setShowEmptyState(true);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToCreateDonation = () => {
    navigation.navigate("QRScannerScreen"); // Navegar para a tela de escanear QR Code
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateCard}>
        <Ionicons
          name="leaf-outline"
          size={48}
          color="#52B788"
          style={styles.emptyStateIcon}
        />
        <Text style={styles.emptyStateTitle}>
          {t("Overview.emptyStateTitle")}
        </Text>
        <Text style={styles.emptyStateSubtitle}>
          {t("Overview.emptyStateSubtitle")}
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={handleNavigateToCreateDonation}
          activeOpacity={0.8}
        >
          <Text style={styles.emptyStateButtonText}>
            {t("Overview.emptyStateButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDonationsList = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#52B788" />
        </View>
      );
    }

    if (showEmptyState) {
      return renderEmptyState();
    }

    const dataToShow =
      selectedTab === "myDonations" ? donationData : allDonationsData;
    const shouldShowUserInfo = selectedTab === "allDonations" && isAdmin;

    return (
      <ScrollView style={styles.donationsListContainer}>
        <OverviewDonationCards
          data={dataToShow}
          showUserInfo={shouldShowUserInfo}
        />
      </ScrollView>
    );
  };

  return (
    <View style={styles.parent}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("Overview.title")}</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {/* Tab "Minhas Doações" - Available for ALL users (including Admin) */}
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "myDonations" && styles.tabActive,
              ]}
              onPress={() => setSelectedTab("myDonations")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "myDonations" && styles.tabTextActive,
                ]}
              >
                {t("Overview.myDonations")}
              </Text>
            </TouchableOpacity>

            {/* Tab "Doações Gerais" - Admin only (shows ALL donations from system) */}
            {isAdmin && (
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "allDonations" && styles.tabActive,
                ]}
                onPress={() => setSelectedTab("allDonations")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === "allDonations" && styles.tabTextActive,
                  ]}
                >
                  {t("Overview.allDonations")}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          {renderDonationsList()}
        </View>
      </ScrollView>

      {/* Floating Action Button - Always visible */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNavigateToCreateDonation}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal de Boas-Vindas Diário */}
      <WelcomeModal
        visible={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
        message={t("Overview.welcomeMessage")}
        title={t("Overview.welcomeTitle")}
        buttonText={t("Overview.welcomeButton")}
      />
    </View>
  );
};

export default ScheduledPickUpScreen;
