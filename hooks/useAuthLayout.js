import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGO_ASPECT_RATIO = 241 / 89;

export const useAuthLayout = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const isCompact = height < 680;
    const isShort = height < 740;

    const horizontalPadding = Math.max(
      20,
      Math.min(Math.round(width * 0.072), 32),
    );
    const sheetRadius = isCompact ? 28 : 40;
    const sheetOverlap = isCompact ? 24 : 36;

    const headerHeight = Math.min(
      Math.max(height * (isCompact ? 0.22 : 0.26), 116),
      height * 0.32,
    );

    const logoWidth = Math.min(
      width - horizontalPadding * 2,
      width * (isCompact ? 0.68 : 0.58),
      240,
    );
    const logoHeight = logoWidth / LOGO_ASPECT_RATIO;

    const maxLogoHeight = headerHeight * 0.55;
    const scaledLogoHeight = Math.min(logoHeight, maxLogoHeight);
    const scaledLogoWidth = scaledLogoHeight * LOGO_ASPECT_RATIO;

    const contentMinHeight = Math.max(
      height - insets.top - insets.bottom,
      height * 0.92,
    );

    return {
      width,
      height,
      isCompact,
      isShort,
      horizontalPadding,
      headerHeight,
      logoWidth: scaledLogoWidth,
      logoHeight: scaledLogoHeight,
      sheetRadius,
      sheetOverlap,
      contentMinHeight,
      footerPaddingVertical: isCompact ? 18 : 24,
    };
  }, [width, height, insets.top, insets.bottom]);
};
