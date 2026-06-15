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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: authSpacing.forgotBottom,
  },
  forgotPasswordText: {
    ...authTypography.forgotPassword,
  },
  formError: {
    color: authColors.error,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: -6,
    marginBottom: 14,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: authColors.actionGreen,
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  loginButtonDisabled: {
    backgroundColor: authColors.actionGreenDisabled,
  },
  loginButtonText: {
    ...authTypography.button,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  registerText: {
    ...authTypography.registerText,
  },
  registerLink: {
    ...authTypography.registerLink,
  },
});
