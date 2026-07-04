import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import { getMaterialColor } from "../utils/recyclingMaterials";

const DonutChart = ({
  segments = [],
  size = 220,
  strokeWidth = 38,
  emptyColor = "#E5E5E5",
}) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const arcs = useMemo(() => {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    if (total <= 0) return [];

    let offset = 0;
    return segments
      .filter((segment) => segment.value > 0)
      .map((segment) => {
        const fraction = segment.value / total;
        const length = fraction * circumference;
        const arc = {
          key: segment.id,
          color: segment.color || getMaterialColor(segment.id),
          length,
          offset,
        };
        offset += length;
        return arc;
      });
  }, [segments, circumference]);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={emptyColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {arcs.map((arc) => (
            <Circle
              key={arc.key}
              cx={center}
              cy={center}
              r={radius}
              stroke={arc.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${arc.length} ${circumference - arc.length}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="butt"
            />
          ))}
        </G>
        <Circle cx={center} cy={center} r={radius - strokeWidth / 2 - 2} fill="#F6FFFB" />
      </Svg>
    </View>
  );
};

export default DonutChart;
