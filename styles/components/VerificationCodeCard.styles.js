import { StyleSheet } from "react-native";
import { authColors, authSpacing, authTypography } from "../../theme/authTheme";

export const styles = StyleSheet.create({
  title: {
    ...authTypography.title,
    marginBottom: authSpacing.titleBottom,
  },
  subtitle: {
    ...authTypography.subtitle,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 14,
    fontWeight: "700",
    color: authColors.primaryDark,
    marginBottom: 24,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  codeInput: {
    flex: 1,
    minWidth: 42,
    height: 52,
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 10,
    backgroundColor: authColors.inputBackground,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: authColors.textPrimary,
  },
  codeInputFocused: {
    borderColor: authColors.borderFocused,
    borderWidth: 1.5,
  },
  codeInputError: {
    borderColor: authColors.error,
    borderWidth: 1.5,
    backgroundColor: authColors.errorBackground,
  },
  helperText: {
    fontSize: 12,
    color: authColors.textSecondary,
    marginBottom: 16,
  },
  errorText: {
    ...authTypography.error,
    marginBottom: 16,
  },
  successText: {
    fontSize: 12,
    color: authColors.primaryDark,
    marginBottom: 16,
  },
  verifyButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: authColors.actionGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  buttonDisabled: {
    backgroundColor: authColors.actionGreenDisabled,
  },
  verifyButtonText: {
    ...authTypography.button,
  },
  resendButton: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: authColors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: authColors.white,
  },
  resendButtonDisabled: {
    borderColor: authColors.border,
    backgroundColor: authColors.footerBackground,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: authColors.primaryDark,
  },
  resendButtonTextDisabled: {
    color: authColors.textSecondary,
  },
});
