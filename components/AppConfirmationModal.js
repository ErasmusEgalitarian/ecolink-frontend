import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/AppConfirmationModal.styles";

const MODAL_VARIANTS = {
  default: {
    icon: "help-circle-outline",
    iconColor: "#52B788",
    confirmStyle: styles.confirmButton,
    confirmTextStyle: styles.confirmButtonText,
  },
  destructive: {
    icon: "log-out-outline",
    iconColor: "#E63946",
    confirmStyle: styles.destructiveButton,
    confirmTextStyle: styles.destructiveButtonText,
  },
};

const AppConfirmationModal = ({
  visible,
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  variant = "default",
  icon,
}) => {
  const variantConfig = MODAL_VARIANTS[variant] || MODAL_VARIANTS.default;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon || variantConfig.icon}
              size={48}
              color={variantConfig.iconColor}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={variantConfig.confirmStyle}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={variantConfig.confirmTextStyle}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppConfirmationModal;
