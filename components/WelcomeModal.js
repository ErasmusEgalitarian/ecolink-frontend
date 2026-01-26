import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/components/WelcomeModal.styles";

const WelcomeModal = ({ visible, onClose, title, message, buttonText }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.message}>{message}</Text>
          
          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WelcomeModal;
