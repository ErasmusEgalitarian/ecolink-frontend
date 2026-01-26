import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 12,
  },
  buttonNo: {
    flex: 1,
    backgroundColor: "#FCA5A5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonNoDark: {
    backgroundColor: "#7F1D1D",
  },
  buttonNoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonNoDarkText: {
    color: "#FFFFFF",
  },
  buttonYes: {
    flex: 1,
    backgroundColor: "#52B788",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonYesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#52B788",
    textDecorationLine: "underline",
  },
});
