import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { formatMaterials, getStatusMeta } from "../utils/ecopoints";
import { styles } from "../styles/components/LocationEcopointItem.styles";

const LocationEcopointItem = ({ ecopoint }) => {
  const { t } = useTranslation();

  if (!ecopoint) {
    return null;
  }

  const statusMeta = getStatusMeta(ecopoint.status, t);

  return (
    <View style={[styles.card, statusMeta.dimmed && styles.cardDimmed]}>
      <View style={styles.header}>
        <Text
          style={[styles.label, statusMeta.dimmed && styles.textDimmed]}
          numberOfLines={2}
        >
          {ecopoint.label}
        </Text>
        <Text style={[styles.status, { color: statusMeta.color }]}>
          {statusMeta.label}
        </Text>
      </View>
      <Text style={[styles.materials, statusMeta.dimmed && styles.textDimmed]}>
        {formatMaterials(ecopoint.acceptedMaterials, t)}
      </Text>
    </View>
  );
};

export default LocationEcopointItem;
