import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { styles } from "../styles/components/PickupStatusBadge.styles";

const STATUS_STYLES = {
  pending: { backgroundColor: "#FFF4CC", color: "#8A6D00" },
  accepted: { backgroundColor: "#D9F2E6", color: "#1A7048" },
  completed: { backgroundColor: "#E8F5E9", color: "#2E7D32" },
  cancelled: { backgroundColor: "#FDE8E8", color: "#B42318" },
};

const PickupStatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const palette = STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <View style={[styles.badge, { backgroundColor: palette.backgroundColor }]}>
      <Text style={[styles.label, { color: palette.color }]}>
        {t(`Collector.status.${status}`, { defaultValue: status })}
      </Text>
    </View>
  );
};

export default PickupStatusBadge;
