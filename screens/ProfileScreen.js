import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/screens/ProfileScreen.styles";

const ProfileScreen = ({ navigation, onLogout }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [userName, setUserName] = useState("Avatar Name");
  const [userEmail, setUserEmail] = useState("avatar@email.com");

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
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

  const handleOptionPress = (option) => {
    setSelectedOption(option === selectedOption ? null : option);
  };

  const handleDonationHistory = () => {
    // Navegar para histórico de doações (já existe no OverviewScreen)
    navigation.navigate("OverviewScreen");
  };

  const handleDonationChart = () => {
    Alert.alert(
      t("Profile.comingSoon"),
      t("Profile.chartFeatureMessage"),
      [{ text: "OK" }]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      t("Profile.comingSoon"),
      t("Profile.passwordFeatureMessage"),
      [{ text: "OK" }]
    );
  };

  const handleLogout = () => {
    Alert.alert(t("Profile.logoutTitle"), t("Profile.logoutMessage"), [
      {
        text: t("Profile.cancel"),
        style: "cancel",
      },
      {
        text: t("Profile.logoutConfirm"),
        style: "destructive",
        onPress: async () => {
          try {
            // Limpar AsyncStorage
            await AsyncStorage.multiRemove([
              "authToken",
              "userId",
              "userName",
              "userEmail",
              "userRole",
            ]);
            
            // Chamar a função onLogout do App.js para mudar o estado isLoggedIn
            if (onLogout) {
              onLogout();
            }
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const renderOption = (option, icon, label, onPress) => {
    const isSelected = selectedOption === option;

    return (
      <TouchableOpacity
        style={[styles.optionButton, isSelected && styles.optionButtonActive]}
        onPress={() => {
          handleOptionPress(option);
          if (onPress) onPress();
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isSelected ? "#FFFFFF" : "#52B788"}
          style={styles.optionIcon}
        />
        <Text
          style={[styles.optionText, isSelected && styles.optionTextActive]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("Profile.title")}</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={32} color="#52B788" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {renderOption(
            "history",
            "time-outline",
            t("Profile.donationHistory"),
            handleDonationHistory
          )}

          {renderOption(
            "chart",
            "bar-chart-outline",
            t("Profile.donationChart"),
            handleDonationChart
          )}

          {renderOption(
            "password",
            "lock-closed-outline",
            t("Profile.changePassword"),
            handleChangePassword
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#E63946" />
          <Text style={styles.logoutText}>{t("Profile.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
