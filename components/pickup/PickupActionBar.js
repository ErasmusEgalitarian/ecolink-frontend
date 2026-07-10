import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { styles } from "../../styles/components/PickupActionBar.styles";

const PickupActionBar = ({
  pickupStatus,
  canManage,
  submitting = false,
  onAccept,
  onComplete,
  onCancel,
  onOpenRoute,
}) => {
  const { t } = useTranslation();

  if (!canManage) {
    return null;
  }

  const renderPrimaryButton = (label, onPress, variant = "primary") => (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "secondary" && styles.buttonSecondary,
        variant === "danger" && styles.buttonDanger,
        submitting && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={submitting}
      activeOpacity={0.85}
    >
      {submitting ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#FDFEFF" : "#28363E"}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === "secondary" && styles.buttonTextSecondary,
            variant === "danger" && styles.buttonTextDanger,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {pickupStatus === "pending" ? (
        renderPrimaryButton(t("Collector.actions.accept"), onAccept)
      ) : null}

      {pickupStatus === "accepted" ? (
        <>
          {onOpenRoute
            ? renderPrimaryButton(
                t("Collector.actions.openRoute"),
                onOpenRoute,
                "secondary",
              )
            : null}
          {renderPrimaryButton(t("Collector.actions.complete"), onComplete)}
          {renderPrimaryButton(
            t("Collector.actions.cancel"),
            onCancel,
            "danger",
          )}
        </>
      ) : null}
    </View>
  );
};

export default PickupActionBar;
