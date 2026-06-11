import { StyleSheet } from "react-native";
import { authColors } from "../../theme/authTheme";

export const styles = StyleSheet.create({
  group: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: authColors.textPrimary,
    marginBottom: 8,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: authColors.inputBackground,
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
  },
  wrapperFocused: {
    borderColor: authColors.borderFocused,
    borderWidth: 1.5,
  },
  wrapperError: {
    borderColor: authColors.error,
    borderWidth: 1.5,
    backgroundColor: authColors.errorBackground,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: authColors.textPrimary,
    paddingVertical: 0,
  },
  toggle: {
    padding: 4,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: authColors.error,
    marginTop: 6,
    marginLeft: 2,
  },
});
