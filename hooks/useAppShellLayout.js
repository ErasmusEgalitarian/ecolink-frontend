import { Platform } from "react-native";

export const PHONE_MAX_WIDTH = 430;
export const TABLET_BREAKPOINT = 600;
export const TABLET_MAX_WIDTH = 960;

export const getAppShellMetrics = (windowWidth) => {
  const isWide = windowWidth >= TABLET_BREAKPOINT;

  let maxContentWidth = windowWidth;

  if (Platform.OS === "web" || isWide) {
    if (windowWidth < TABLET_BREAKPOINT) {
      maxContentWidth = PHONE_MAX_WIDTH;
    } else if (windowWidth < 1024) {
      maxContentWidth = Math.round(Math.min(windowWidth * 0.92, 800));
    } else {
      maxContentWidth = Math.round(
        Math.min(windowWidth * 0.88, TABLET_MAX_WIDTH),
      );
    }
  }

  const shouldConstrain = Platform.OS === "web" || isWide;
  const isPhoneFrame = maxContentWidth <= PHONE_MAX_WIDTH;
  const outerBackground =
    isPhoneFrame && Platform.OS === "web" ? "#1A3C2B" : "#F6FFFB";

  return {
    maxContentWidth,
    shouldConstrain,
    isWide,
    isPhoneFrame,
    outerBackground,
  };
};
