import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
