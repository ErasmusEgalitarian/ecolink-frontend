import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#E2F3EC",
  },
  placeholder: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#E2F3EC",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  placeholderText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#628397",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#E2F3EC",
  },
  actionButtonText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    color: "#1A7048",
  },
  helperText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#628397",
  },
  errorText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    color: "#E63946",
  },
});
