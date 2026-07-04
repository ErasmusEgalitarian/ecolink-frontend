import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    padding: 20,
    gap: 12,
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 4,
  },
  cardDimmed: {
    backgroundColor: "#F3F6F8",
    opacity: 0.72,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 19,
  },
  name: {
    flex: 1,
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 20,
    color: "#141B1F",
    textDecorationLine: "none",
  },
  status: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "right",
    textDecorationLine: "none",
  },
  info: {
    gap: 8,
  },
  distance: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4E6879",
    textDecorationLine: "none",
  },
  type: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#28363E",
    textDecorationLine: "none",
  },
  textDimmed: {
    color: "#8A9BA8",
  },
});
