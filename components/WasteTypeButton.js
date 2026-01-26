import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/WasteTypeButton.styles";

const WasteTypeButton = ({ icon, label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isSelected && styles.buttonSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={28} color="#FFFFFF" />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default WasteTypeButton;
