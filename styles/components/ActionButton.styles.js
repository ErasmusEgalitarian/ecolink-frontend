import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#52B788",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
