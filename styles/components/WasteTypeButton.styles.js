import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#52B788",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonSelected: {
    backgroundColor: "#2D6A4F",
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 16,
  },
});
