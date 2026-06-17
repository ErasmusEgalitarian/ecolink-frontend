import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/components/ConnectionErrorCard.styles";

const ConnectionErrorCard = ({ title, message, retryLabel, onRetry, style }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.card, style]}>
      <Ionicons name="cloud-offline-outline" size={36} color="#D97706" />
      <Text style={styles.title}>{title || t("Api.connectionTitle")}</Text>
      <Text style={styles.message}>
        {message || t("Api.connectionMessage")}
      </Text>

      {onRetry ? (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Text style={styles.retryButtonText}>
            {retryLabel || t("Api.retry")}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ConnectionErrorCard;
