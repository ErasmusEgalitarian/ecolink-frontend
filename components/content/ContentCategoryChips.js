import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { styles } from "../../styles/components/ContentCategoryChips.styles";

const ContentCategoryChips = ({
  categories,
  selectedSlug,
  onSelect,
  allLabel,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[styles.chip, !selectedSlug && styles.chipActive]}
          onPress={() => onSelect("")}
          activeOpacity={0.8}
        >
          <Text style={[styles.chipText, !selectedSlug && styles.chipTextActive]}>
            {allLabel}
          </Text>
        </TouchableOpacity>

        {categories.map((category) => {
          const isActive = selectedSlug === category.slug;
          return (
            <TouchableOpacity
              key={category.slug}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(category.slug)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ContentCategoryChips;
