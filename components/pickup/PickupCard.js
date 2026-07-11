import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import PickupStatusBadge from "./PickupStatusBadge";
import {
  getPickupCreatedLabel,
  getPickupEcopointLabel,
  getPickupEcopointStatus,
  getPickupLocationName,
} from "../../utils/pickupDisplay";
import { getStatusMeta } from "../../utils/ecopoints";
import { styles } from "../../styles/components/PickupCard.styles";

const PickupCard = ({ pickup, onPress, showActionHint = false }) => {
  const { t } = useTranslation();

  if (!pickup) {
    return null;
  }

  const locationName = getPickupLocationName(pickup, t);
  const ecopointLabel = getPickupEcopointLabel(pickup, t);
  const ecopointStatus = getPickupEcopointStatus(pickup);
  const ecopointStatusMeta = ecopointStatus
    ? getStatusMeta(ecopointStatus, t)
    : null;
  const createdLabel = getPickupCreatedLabel(pickup, t);
  const donationsCount = pickup.donations?.length;

  const content = (
    <>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.locationName} numberOfLines={2}>
            {locationName}
          </Text>
          <Text style={styles.ecopointLabel} numberOfLines={1}>
            {ecopointLabel}
          </Text>
        </View>
        <PickupStatusBadge status={pickup.pickupStatus} />
      </View>

      <View style={styles.metaRow}>
        {ecopointStatusMeta ? (
          <Text style={[styles.ecopointStatus, { color: ecopointStatusMeta.color }]}>
            {t("Collector.ecopointStatus", { status: ecopointStatusMeta.label })}
          </Text>
        ) : null}
        {createdLabel ? (
          <Text style={styles.createdAt}>{createdLabel}</Text>
        ) : null}
      </View>

      {typeof donationsCount === "number" ? (
        <Text style={styles.donationsCount}>
          {t("Collector.donationsCount", { count: donationsCount })}
        </Text>
      ) : null}

      {showActionHint ? (
        <View style={styles.actionHintRow}>
          <Text style={styles.actionHint}>{t("Collector.viewDetails")}</Text>
          <Ionicons name="chevron-forward" size={16} color="#29A66C" />
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(pickup)}
        activeOpacity={0.85}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
};

export default PickupCard;
