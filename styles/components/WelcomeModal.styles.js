import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
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
  message: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#52B788",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 28,
  },
  button: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
});
