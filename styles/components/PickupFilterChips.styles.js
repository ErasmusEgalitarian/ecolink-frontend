import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FDFEFF",
    borderWidth: 1,
    borderColor: "#B5E8D0",
  },
  chipActive: {
    backgroundColor: "#29A66C",
    borderColor: "#29A66C",
  },
  chipText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    color: "#1A7048",
  },
  chipTextActive: {
    color: "#FDFEFF",
  },
});
