import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/components/ConfirmationModal.styles";

const ConfirmationModal = ({
  visible,
  onClose,
  title,
  boldText,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = "default", // 'default' ou 'cancel'
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {(boldText || message) && (
            <Text style={styles.subtitle}>
              {boldText && boldText}{boldText && message && " "}{message}
            </Text>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[
                styles.buttonNo,
                variant === "cancel" && styles.buttonNoDark,
              ]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.buttonNoText,
                  variant === "cancel" && styles.buttonNoDarkText,
                ]}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonYes}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonYesText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>

          {variant === "cancel" && (
            <TouchableOpacity style={styles.linkButton} onPress={onClose}>
              <Text style={styles.linkText}>Sim</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
