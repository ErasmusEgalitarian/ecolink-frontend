import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { api, SEMESTER_ROUTES } from "../config/api";
import { useAppContentWidth } from "../context/AppShellContext";
import { styles } from "../styles/screens/DashboardScreen.styles";

const getDashboardLayout = (contentWidth) => {
  const paddingH = Math.max(20, Math.min(Math.round(contentWidth * 0.08), 32));

  return { paddingH };
};

const getMotivationalText = (pct, t) => {
  if (pct <= 0) return t("Dashboard.motivational_start");
  if (pct < 0.25) return t("Dashboard.motivational_going");
  if (pct <= 0.5) return t("Dashboard.motivational_half");
  if (pct < 0.75) return t("Dashboard.motivational_more");
  if (pct < 1) return t("Dashboard.motivational_almost");
  return t("Dashboard.motivational_done");
};

// Arc constants — center is at the bottom edge of the viewBox so the arc
// fills the entire SVG height and leaves no dead space above.
const G = { cx: 80, cy: 96, r: 68, sw: 13, w: 160, h: 100 };

const SemicircleGauge = ({ current, goal }) => {
  const pct        = goal > 0 ? Math.min(current / goal, 1) : 0;
  const circum     = 2 * Math.PI * G.r;
  const halfCircum = Math.PI * G.r;
  const rot        = `rotate(180, ${G.cx}, ${G.cy})`;

  return (
    <View style={gaugeStyles.wrapper}>
      {/* Arc rendered in SVG — text is overlaid as React Native Views
          so Montserrat fonts are guaranteed correct on every platform */}
      <Svg
        width={G.w}
        height={G.h}
        viewBox={`0 0 ${G.w} ${G.h}`}
        style={gaugeStyles.svg}
      >
        {/* Track */}
        <Circle
          cx={G.cx} cy={G.cy} r={G.r}
          fill="none" stroke="#B5E8D0"
          strokeWidth={G.sw} strokeLinecap="round"
          strokeDasharray={`${halfCircum} ${circum}`}
          transform={rot}
        />
        {/* Progress */}
        {pct > 0.005 && (
          <Circle
            cx={G.cx} cy={G.cy} r={G.r}
            fill="none" stroke="#29A66C"
            strokeWidth={G.sw} strokeLinecap="round"
            strokeDasharray={`${pct * halfCircum} ${circum}`}
            transform={rot}
          />
        )}
      </Svg>

      <View style={gaugeStyles.textOverlay}>
        <View style={gaugeStyles.currentRow}>
          <Text style={gaugeStyles.currentNum}>{current}</Text>
        </View>

        <View style={gaugeStyles.separator} />

        <View style={gaugeStyles.goalRow}>
          <Text style={gaugeStyles.goalNum}>{goal}</Text>
        </View>
      </View>
    </View>
  );
};

const gaugeStyles = StyleSheet.create({
  wrapper: {
    width: G.w,
    height: G.h,
    overflow: "visible",
  },
  svg: {
    position: "absolute",
    top: -72,
    left: -1,
    right: 0,
    bottom: 0,
  },
  // Centered in the arch opening, aligned with shifted SVG
  textOverlay: {
    position: "absolute",
    top: -30,
    left: 4,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  currentRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  currentNum: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 28,
    lineHeight: 32,
    color: "#141B1F",
  },
  separator: {
    width: 76,
    height: 0.6,
    backgroundColor: "#9FB4C1",
    marginBottom: 5,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  goalNum: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
    lineHeight: 22,
    color: "#628397",
  },
});

const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const contentWidth = useAppContentWidth();
  const layout = useMemo(
    () => getDashboardLayout(contentWidth),
    [contentWidth],
  );
  const [userName, setUserName] = useState("");
  const [semesterProgress, setSemesterProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadData = async () => {
        setLoading(true);
        try {
          const name = await AsyncStorage.getItem("userName");
          if (!active) return;
          setUserName(name ? name.split(" ")[0] : "");

          const response = await api.get(SEMESTER_ROUTES.CURRENT_PROGRESS);
          if (!active) return;

          setSemesterProgress(response.data?.data || null);
        } catch (error) {
          console.error("[DashboardScreen] Error loading data:", error);
        } finally {
          if (active) setLoading(false);
        }
      };

      loadData();
      return () => { active = false; };
    }, [])
  );

  const donatedAmount     = semesterProgress?.donatedAmount ?? 0;
  const goalAmount        = semesterProgress?.goalAmount ?? 0;
  const percentageDisplay = semesterProgress?.percentage ?? 0;
  const percentage        = goalAmount > 0 ? donatedAmount / goalAmount : 0;

  const handleDonate    = () => navigation.navigate("QRScannerScreen");
  const handleOverview  = () => navigation.navigate("OverviewScreen");
  const handleEcopoints = () =>
    navigation.getParent()?.navigate("Mapa") ?? navigation.navigate("Mapa");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: layout.paddingH },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>
              {t("Dashboard.greeting")}
            </Text>
            <Text style={styles.headerName}>{userName}!</Text>
          </View>
          <TouchableOpacity
            style={styles.helpButton}
            activeOpacity={0.8}
            accessibilityLabel="Ajuda"
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressCardTitle}>
            {t("Dashboard.semesterTitle")}
          </Text>
          <View style={styles.progressCardContent}>
            <View style={styles.progressLeft}>
              {loading ? (
                <ActivityIndicator size="small" color="#29A66C" />
              ) : (
                <>
                  <Text style={styles.percentageText}>
                    {percentageDisplay}%
                  </Text>
                  <Text style={styles.motivationalText}>
                    {getMotivationalText(percentage, t)}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.gaugeContainer}>
              <SemicircleGauge
                current={donatedAmount}
                goal={goalAmount}
              />
            </View>
          </View>
        </View>

        {/* Quick-access Cards */}
        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={handleEcopoints}
            activeOpacity={0.8}
          >
            <View style={styles.quickCardIconContainer}>
              <Ionicons name="location-outline" size={22} color="#1A7048" />
            </View>
            <Text style={styles.quickCardText}>
              {t("Dashboard.ecopoints")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={handleOverview}
            activeOpacity={0.8}
          >
            <View style={styles.quickCardIconContainer}>
              <Ionicons name="location-outline" size={22} color="#1A7048" />
            </View>
            <Text style={styles.quickCardText}>
              {t("Dashboard.generalDonations")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CTA — fixed width, right-aligned (Figma: width 192, right 32) */}
      <TouchableOpacity
        style={[styles.donateButton, { right: layout.paddingH }]}
        onPress={handleDonate}
        activeOpacity={0.85}
      >
        <Text style={styles.donateButtonText}>
          {t("Dashboard.donate")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DashboardScreen;
