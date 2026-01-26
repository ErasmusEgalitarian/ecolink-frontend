import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/ErrorModal.styles";

const ErrorModal = ({ visible, title, message, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Ionicons name="alert-circle" size={80} color="#E63946" />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;
