import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  formatDistance,
  formatMaterials,
  getStatusMeta,
} from "../utils/ecopoints";
import { styles } from "../styles/components/EcopointCard.styles";

const EcopointCard = ({ location, onPress }) => {
  const { t, i18n } = useTranslation();

  if (!location) {
    return null;
  }

  const statusMeta = getStatusMeta(location.status, t);

  const content = (
    <>
      <View style={styles.topBar}>
        <Text
          style={[styles.name, statusMeta.dimmed && styles.textDimmed]}
          numberOfLines={2}
        >
          {location.name}
        </Text>
        <Text style={[styles.status, { color: statusMeta.color }]}>
          {statusMeta.label}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.distance, statusMeta.dimmed && styles.textDimmed]}>
          {formatDistance(location.distance, t, i18n.language)}
        </Text>
        <Text style={[styles.type, statusMeta.dimmed && styles.textDimmed]}>
          {formatMaterials(location.acceptedMaterials, t)}
        </Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, statusMeta.dimmed && styles.cardDimmed]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, statusMeta.dimmed && styles.cardDimmed]}>
      {content}
    </View>
  );
};

export default EcopointCard;
