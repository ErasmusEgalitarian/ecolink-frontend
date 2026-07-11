import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summaryCard: {
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    padding: 20,
    gap: 8,
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    lineHeight: 18,
    color: "#4E6879",
  },
  summaryValue: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    lineHeight: 24,
    color: "#141B1F",
  },
  materialsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  materialChip: {
    backgroundColor: "#F6FFFB",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  materialChipText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
  },
  listTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 21,
    color: "#141B1F",
  },
  list: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    padding: 20,
  },
  emptyText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4E6879",
    textAlign: "center",
  },
});
