import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/components/InstructionText.styles";

const InstructionText = ({ part1, boldText, part2 }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {part1} <Text style={styles.bold}>{boldText}</Text> {part2}
      </Text>
    </View>
  );
};

export default InstructionText;
