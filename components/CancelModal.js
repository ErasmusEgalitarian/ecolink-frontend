import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/components/CancelModal.styles";

const CancelModal = ({
  visible,
  onClose,
  title,
  subtitle,
  cancelText = "Não",
  confirmText = "Sim",
  onCancel,
  onConfirm,
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
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.buttonNo}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonNoText}>{cancelText}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.linkButton} onPress={onConfirm}>
            <Text style={styles.linkText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CancelModal;
