import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#5A5A5A",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#E63946",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
