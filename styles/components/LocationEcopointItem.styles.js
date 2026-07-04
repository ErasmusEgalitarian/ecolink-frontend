import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  cardDimmed: {
    backgroundColor: "#F3F6F8",
    opacity: 0.72,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  label: {
    flex: 1,
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 20,
    color: "#141B1F",
  },
  status: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "right",
  },
  materials: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#28363E",
  },
  textDimmed: {
    color: "#8A9BA8",
  },
});
