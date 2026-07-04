import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation, Trans } from "react-i18next";

import ConnectionErrorCard from "./ConnectionErrorCard";
import RecentDonationCard from "./RecentDonationCard";
import SemesterProgressBar from "./SemesterProgressBar";
import { styles } from "../styles/components/SemesterDonationsView.styles";

const SemesterDonationsView = ({
  title,
  donatedAmount = 0,
  goalAmount = 0,
  percentage = 0,
  donations = [],
  loading = false,
  connectionError = false,
  onBack,
  onRetry,
  onExportHistory,
}) => {
  const { t } = useTranslation();

  const renderHistory = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29A66C" />
        </View>
      );
    }

    if (connectionError) {
      return <ConnectionErrorCard onRetry={onRetry} />;
    }

    if (donations.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t("MyDonations.emptyTitle")}</Text>
          <Text style={styles.emptyMessage}>
            {t("MyDonations.emptyMessage")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.list}>
        {donations.map((donation) => (
          <RecentDonationCard key={donation._id} donation={donation} />
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityLabel={t("QRScanner.backButton")}
        >
          <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title ?? t("MyDonations.title")}</Text>

      <View style={styles.progressSection}>
        <Text style={styles.summaryText}>
          <Trans
            i18nKey="MyDonations.summary"
            values={{
              donated: Math.round(donatedAmount),
              goal: Math.round(goalAmount),
            }}
            components={{
              bold: <Text style={styles.summaryBold} />,
            }}
          />
        </Text>

        <SemesterProgressBar percentage={percentage} />

        <Text style={styles.goalHint}>{t("MyDonations.goalHint")}</Text>
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>{t("MyDonations.historyTitle")}</Text>
        <TouchableOpacity
          onPress={onExportHistory}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.exportLink}>{t("MyDonations.exportHistory")}</Text>
        </TouchableOpacity>
      </View>

      {renderHistory()}
    </ScrollView>
  );
};

export default SemesterDonationsView;
