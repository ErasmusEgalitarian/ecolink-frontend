import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { styles } from "../styles/components/SemesterHistoryCard.styles";

const SemesterHistoryCard = ({ semester, onPress }) => {
  const { t } = useTranslation();
  const donatedAmount = Math.round(semester.donatedAmount ?? 0);
  const percentage = semester.percentage ?? 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(semester)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={t("DonationHistory.semesterCardLabel", {
        name: semester.name,
        donated: donatedAmount,
      })}
    >
      <Text style={styles.name}>{semester.name}</Text>
      <View style={styles.footer}>
        <Text style={styles.amount}>
          {t("DonationHistory.donatedAmount", { amount: donatedAmount })}
        </Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SemesterHistoryCard;
