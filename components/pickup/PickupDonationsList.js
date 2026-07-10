import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import RecentDonationCard from "../RecentDonationCard";
import {
  formatDonationWeight,
  getDonationMaterialLabelKey,
  getRecentDonationMaterialColor,
} from "../../utils/donationDisplay";
import { summarizePickupDonations } from "../../utils/pickupDisplay";
import { styles } from "../../styles/components/PickupDonationsList.styles";

const PickupDonationsList = ({ donations = [], titleOverride }) => {
  const { t } = useTranslation();
  const summary = summarizePickupDonations(donations);

  if (donations.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>{t("Collector.noDonationsInPickup")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{t("Collector.batchSummaryTitle")}</Text>
        <Text style={styles.summaryValue}>
          {t("Collector.batchSummaryValue", {
            count: summary.totalItems,
            weight: formatDonationWeight(summary.totalWeight, t),
          })}
        </Text>
        <View style={styles.materialsRow}>
          {Object.entries(summary.byMaterial).map(([material, weight]) => (
            <View key={material} style={styles.materialChip}>
              <Text
                style={[
                  styles.materialChipText,
                  { color: getRecentDonationMaterialColor(material) },
                ]}
              >
                {t(getDonationMaterialLabelKey(material))}:{" "}
                {formatDonationWeight(weight, t)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.listTitle}>
        {titleOverride || t("Collector.donationsListTitle")}
      </Text>
      <View style={styles.list}>
        {donations.map((donation) => (
          <RecentDonationCard
            key={donation._id || donation.id}
            donation={donation}
          />
        ))}
      </View>
    </View>
  );
};

export default PickupDonationsList;
