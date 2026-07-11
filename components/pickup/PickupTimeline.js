import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  buildPickupTimeline,
  formatPickupTimelineDate,
  PICKUP_STATUS_COLORS,
} from "../../utils/pickupDisplay";
import { styles } from "../../styles/components/PickupTimeline.styles";

const PickupTimeline = ({ pickup }) => {
  const { t, i18n } = useTranslation();
  const steps = buildPickupTimeline(pickup);

  if (steps.length === 0) {
    return null;
  }

  const acceptorName = pickup?.pickupBy?.username?.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Collector.timeline.title")}</Text>

      <View style={styles.list}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const color =
            step.key === "cancelled"
              ? PICKUP_STATUS_COLORS.cancelled
              : step.isTerminal
                ? PICKUP_STATUS_COLORS[step.key] || PICKUP_STATUS_COLORS.default
                : PICKUP_STATUS_COLORS.completed;

          return (
            <View key={step.key} style={styles.row}>
              <View style={styles.trackColumn}>
                <View style={[styles.dot, { backgroundColor: color, borderColor: color }]} />
                {!isLast ? <View style={styles.line} /> : null}
              </View>

              <View style={[styles.content, isLast && styles.contentLast]}>
                <Text style={[styles.stepLabel, step.isTerminal && { color }]}>
                  {t(`Collector.timeline.${step.key}`)}
                </Text>
                <Text style={styles.stepDate}>
                  {formatPickupTimelineDate(step.date, i18n.language)}
                </Text>
                {step.key === "accepted" && acceptorName ? (
                  <Text style={styles.stepMeta}>
                    {t("Collector.timeline.acceptedBy", { name: acceptorName })}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PickupTimeline;
