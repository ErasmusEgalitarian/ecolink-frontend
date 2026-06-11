export const authColors = {
  primaryDark: "#1A7048",
  actionGreen: "#2BA86D",
  actionGreenDisabled: "#7BC9A0",
  textPrimary: "#333333",
  textSecondary: "#828282",
  linkMuted: "#6B7C8F",
  border: "#D9D9D9",
  borderFocused: "#2BA86D",
  inputBackground: "#FFFFFF",
  sheetBackground: "#FFFFFF",
  pageBackground: "#1A7048",
  footerBackground: "#E8EDE9",
  footerBorder: "#D5DDD8",
  error: "#E63946",
  errorBackground: "#FFF5F5",
  white: "#FFFFFF",
};

export const authTypography = {
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: authColors.primaryDark,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: authColors.textPrimary,
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: authColors.textPrimary,
  },
  input: {
    fontSize: 15,
    fontWeight: "400",
    color: authColors.textPrimary,
  },
  button: {
    fontSize: 16,
    fontWeight: "700",
    color: authColors.white,
  },
  forgotPassword: {
    fontSize: 13,
    fontWeight: "400",
    color: authColors.linkMuted,
  },
  registerText: {
    fontSize: 14,
    fontWeight: "400",
    color: authColors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: authColors.primaryDark,
    textDecorationLine: "underline",
  },
  error: {
    fontSize: 12,
    color: authColors.error,
  },
};

export const authSpacing = {
  titleBottom: 6,
  subtitleBottom: 28,
  fieldGap: 18,
  labelBottom: 8,
  forgotBottom: 24,
  buttonBottom: 16,
  footerVertical: 24,
};
