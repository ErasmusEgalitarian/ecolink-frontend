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
  passwordRequirementsContainer: {
    backgroundColor: authColors.errorBackground,
    borderColor: authColors.error,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: -8,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  passwordRequirementsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: authColors.error,
    marginBottom: 6,
  },
  passwordRequirementMissing: {
    fontSize: 12,
    color: authColors.error,
    lineHeight: 18,
  },
  formError: {
    color: authColors.error,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: -4,
    marginBottom: 14,
    textAlign: "center",
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
