import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  formatDonationWeight,
  formatRelativeTime,
  getDonationLocationLabel,
  getDonationMaterialLabelKey,
  getRecentDonationMaterialColor,
} from "../utils/donationDisplay";
import { styles } from "../styles/components/RecentDonationCard.styles";

const RecentDonationCard = ({ donation }) => {
  const { t } = useTranslation();

  if (!donation) {
    return null;
  }

  const materialType = donation.materialType;
  const materialLabel = t(getDonationMaterialLabelKey(materialType));
  const materialColor = getRecentDonationMaterialColor(materialType);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.materialName, { color: materialColor }]}>
          {materialLabel}
        </Text>
        <Text style={styles.timeAgo}>
          {formatRelativeTime(donation.donationDate, t)}
        </Text>
      </View>
      <Text style={styles.weight}>
        {formatDonationWeight(donation.qtdMaterial, t)}
      </Text>
      <Text style={styles.location}>
        {getDonationLocationLabel(donation, t)}
      </Text>
    </View>
  );
};

export default RecentDonationCard;
