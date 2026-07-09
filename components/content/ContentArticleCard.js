import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../styles/components/ContentArticleCard.styles";

const ContentArticleCard = ({
  article,
  categoryLabel,
  onPress,
  featured = false,
  statusLabel,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, featured && styles.featuredCard]}
      onPress={() => onPress?.(article)}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      {article.coverUrl ? (
        <Image source={{ uri: article.coverUrl }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Ionicons name="leaf-outline" size={28} color="#29A66C" />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.metaRow}>
          {categoryLabel ? (
            <Text style={styles.category}>{categoryLabel}</Text>
          ) : null}
          {statusLabel ? (
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{statusLabel}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        {article.excerpt ? (
          <Text style={styles.excerpt} numberOfLines={featured ? 2 : 3}>
            {article.excerpt}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default ContentArticleCard;
