import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { getPickupStatusMeta } from "../../utils/pickupDisplay";
import { styles } from "../../styles/components/PickupStatusBadge.styles";

const PickupStatusBadge = ({ status }) => {
  const { t } = useTranslation();

  if (!status) {
    return null;
  }

  const meta = getPickupStatusMeta(status, t);

  return (
    <View style={[styles.badge, { backgroundColor: `${meta.color}22` }]}>
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
};

export default PickupStatusBadge;
