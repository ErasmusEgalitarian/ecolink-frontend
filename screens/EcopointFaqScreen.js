import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ECOPOINT_STATUS_COLORS } from "../utils/ecopoints";
import { goBackInDonationsStack } from "../utils/donationsNavigation";
import { styles } from "../styles/screens/EcopointFaqScreen.styles";

const FAQ_SECTIONS = [
  {
    titleKey: "activeTitle",
    color: ECOPOINT_STATUS_COLORS.open,
    part1Key: "activeDescriptionPart1",
    boldKey: "activeDescriptionBold",
    part2Key: "activeDescriptionPart2",
  },
  {
    titleKey: "fullTitle",
    color: ECOPOINT_STATUS_COLORS.full,
    part1Key: "fullDescriptionPart1",
    boldKey: "fullDescriptionBold",
    part2Key: "fullDescriptionPart2",
  },
  {
    titleKey: "offlineTitle",
    color: ECOPOINT_STATUS_COLORS.offline,
    part1Key: "offlineDescriptionPart1",
    boldKey: "offlineDescriptionBold",
    part2Key: "offlineDescriptionPart2",
  },
  {
    titleKey: "closedTitle",
    color: ECOPOINT_STATUS_COLORS.closed,
    part1Key: "closedDescriptionPart1",
    boldKey: "closedDescriptionBold",
    part2Key: "closedDescriptionPart2",
  },
];

const EcopointFaqScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const handleBack = () => goBackInDonationsStack(navigation);

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

        <Text style={styles.title}>{t("EcopointFaq.title")}</Text>

        <View style={styles.sections}>
          {FAQ_SECTIONS.map((section) => (
            <View key={section.titleKey} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: section.color }]}>
                {t(`EcopointFaq.${section.titleKey}`)}
              </Text>
              <Text style={styles.sectionBody}>
                {t(`EcopointFaq.${section.part1Key}`)}
                <Text style={styles.sectionBodyBold}>
                  {t(`EcopointFaq.${section.boldKey}`)}
                </Text>
                {t(`EcopointFaq.${section.part2Key}`)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EcopointFaqScreen;
