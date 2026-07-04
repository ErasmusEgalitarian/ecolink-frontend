import { createContext, useContext } from "react";
import { useWindowDimensions } from "react-native";

import { getAppShellMetrics } from "../hooks/useAppShellLayout";

const AppShellContext = createContext(null);

export const AppShellProvider = AppShellContext.Provider;

export const useAppShell = () => {
  const context = useContext(AppShellContext);
  const { width } = useWindowDimensions();

  if (context) {
    return context;
  }

  return {
    contentWidth: width,
    ...getAppShellMetrics(width),
  };
};

export const useAppContentWidth = () => {
  const { contentWidth } = useAppShell();
  const { width } = useWindowDimensions();
  return contentWidth ?? width;
};
