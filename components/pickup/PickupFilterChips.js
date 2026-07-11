import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { styles } from "../../styles/components/PickupFilterChips.styles";

export const MY_PICKUP_FILTERS = ["all", "accepted", "completed", "cancelled"];

const PickupFilterChips = ({ selectedFilter, onSelect, counts = {} }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {MY_PICKUP_FILTERS.map((filter) => {
        const isActive = selectedFilter === filter;
        const count = counts[filter];

        return (
          <TouchableOpacity
            key={filter}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(filter)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {t(`Collector.myPickupFilters.${filter}`)}
              {typeof count === "number" ? ` (${count})` : ""}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PickupFilterChips;
