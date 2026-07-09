import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  cover: {
    width: "100%",
    height: 140,
    backgroundColor: "#E2F3EC",
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 16,
    gap: 8,
  },
  category: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: "#29A66C",
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 22,
    color: "#1A7048",
  },
  excerpt: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4E6879",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  statusBadge: {
    backgroundColor: "#FFF4E5",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 10,
    lineHeight: 12,
    color: "#CE8A0B",
    textTransform: "uppercase",
  },
  featuredCard: {
    width: 260,
  },
});
