import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/HeaderWithBack.styles";

const HeaderWithBack = ({ onBack, rightIcon, rightIconColor = "#52B788" }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      {rightIcon && (
        <Ionicons name={rightIcon} size={28} color={rightIconColor} />
      )}
    </View>
  );
};

export default HeaderWithBack;
