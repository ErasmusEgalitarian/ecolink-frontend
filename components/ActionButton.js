import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/components/ActionButton.styles";

const ActionButton = ({ onPress, text, disabled = false }) => {
  if (disabled) return null;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
