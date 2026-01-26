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
    backgroundColor: "#52B788",
    borderRadius: 20,
    padding: 40,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 60,
    padding: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.95,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#52B788",
  },
});
