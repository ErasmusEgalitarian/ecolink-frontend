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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  locationName: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 20,
    color: "#141B1F",
  },
  ecopointLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 18,
    color: "#4E6879",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  ecopointStatus: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
  },
  createdAt: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#809CAD",
    textAlign: "right",
  },
  donationsCount: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    lineHeight: 18,
    color: "#28363E",
  },
  actionHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  actionHint: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 13,
    lineHeight: 16,
    color: "#29A66C",
  },
});
