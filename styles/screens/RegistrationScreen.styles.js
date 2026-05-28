import { StyleSheet } from "react-native";
import { authColors, authSpacing, authTypography } from "../../theme/authTheme";

export const styles = StyleSheet.create({
  title: {
    ...authTypography.title,
    marginBottom: authSpacing.titleBottom,
  },
  subtitle: {
    ...authTypography.subtitle,
    marginBottom: authSpacing.subtitleBottom,
  },
  registerButton: {
    backgroundColor: authColors.actionGreen,
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  registerButtonDisabled: {
    backgroundColor: authColors.actionGreenDisabled,
  },
  registerButtonText: {
    ...authTypography.button,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  loginText: {
    ...authTypography.registerText,
  },
  loginLink: {
    ...authTypography.registerLink,
  },
});
