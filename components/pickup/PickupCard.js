import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import PickupStatusBadge from "./PickupStatusBadge";
import {
  getPickupEcopointLabel,
  getPickupEcopointStatus,
  getPickupLocationName,
} from "../../utils/pickupDisplay";
import { getStatusMeta } from "../../utils/ecopoints";
import { styles } from "../../styles/components/PickupCard.styles";

const PickupCard = ({ pickup, onPress, donationCount = null }) => {
  const { t } = useTranslation();
  const locationName = getPickupLocationName(pickup, t);
  const ecopointLabel = getPickupEcopointLabel(pickup);
  const ecopointStatus = getPickupEcopointStatus(pickup);
  const statusMeta = ecopointStatus
    ? getStatusMeta(ecopointStatus, t)
    : null;

  const content = (
    <>
      <View style={styles.topRow}>
        <Text style={styles.locationName} numberOfLines={2}>
          {locationName}
        </Text>
        <PickupStatusBadge status={pickup.pickupStatus} />
      </View>

      {ecopointLabel ? (
        <Text style={styles.ecopointLabel}>{ecopointLabel}</Text>
      ) : null}

      <View style={styles.footerRow}>
        {statusMeta ? (
          <Text style={[styles.ecopointStatus, { color: statusMeta.color }]}>
            {statusMeta.label}
          </Text>
        ) : null}
        {donationCount != null ? (
          <Text style={styles.donationCount}>
            {t("Collector.donationCount", { count: donationCount })}
          </Text>
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
};

export default PickupCard;
