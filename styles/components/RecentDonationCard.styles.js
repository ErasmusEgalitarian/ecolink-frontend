import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    paddingHorizontal: 21,
    paddingVertical: 20,
    gap: 8,
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  materialName: {
    flex: 1,
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 20,
  },
  timeAgo: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#4E6879",
    textAlign: "right",
  },
  weight: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    lineHeight: 20,
    color: "#141B1F",
  },
  location: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#28363E",
  },
});
