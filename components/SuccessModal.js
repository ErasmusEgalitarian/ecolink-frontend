import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/SuccessModal.styles";

const SuccessModal = ({ visible, title, message, onConfirm, buttonText }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={96} color="#52B788" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {buttonText || "Voltar para a tela inicial"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
