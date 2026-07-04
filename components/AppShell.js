import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";

import { AppShellProvider } from "../context/AppShellContext";
import { getAppShellMetrics } from "../hooks/useAppShellLayout";

export default function AppShell({ children }) {
  const { width } = useWindowDimensions();
  const metrics = useMemo(() => getAppShellMetrics(width), [width]);
  const [measuredWidth, setMeasuredWidth] = useState(null);

  const contextValue = useMemo(
    () => ({
      ...metrics,
      contentWidth: measuredWidth ?? metrics.maxContentWidth,
    }),
    [metrics, measuredWidth],
  );

  if (!metrics.shouldConstrain) {
    return (
      <AppShellProvider value={contextValue}>{children}</AppShellProvider>
    );
  }

  return (
    <AppShellProvider value={contextValue}>
      <View
        style={[styles.outer, { backgroundColor: metrics.outerBackground }]}
      >
        <View
          style={[
            styles.inner,
            { maxWidth: metrics.maxContentWidth },
            metrics.isPhoneFrame &&
              Platform.OS === "web" &&
              styles.innerPhoneShadow,
          ]}
          onLayout={(event) => {
            setMeasuredWidth(event.nativeEvent.layout.width);
          }}
        >
          {children}
        </View>
      </View>
    </AppShellProvider>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inner: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#F6FFFB",
  },
  innerPhoneShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 40,
    elevation: 24,
  },
});
