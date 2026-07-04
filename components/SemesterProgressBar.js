import React from "react";
import { Text, View } from "react-native";

import { styles } from "../styles/components/SemesterProgressBar.styles";

const SemesterProgressBar = ({ percentage = 0 }) => {
  const clamped = Math.min(Math.max(Number(percentage) || 0, 0), 100);
  const displayPct = Math.round(clamped);
  const showLabelInside = clamped >= 18;

  return (
    <View style={styles.track}>
      {clamped > 0 && (
        <View style={[styles.fill, { width: `${clamped}%` }]}>
          {showLabelInside && (
            <Text style={styles.percentText}>{displayPct}%</Text>
          )}
        </View>
      )}
      {!showLabelInside && clamped > 0 && (
        <Text style={styles.percentTextOutside}>{displayPct}%</Text>
      )}
    </View>
  );
};

export default SemesterProgressBar;
