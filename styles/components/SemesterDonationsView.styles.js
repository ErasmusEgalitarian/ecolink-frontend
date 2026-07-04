import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 32,
    paddingBottom: 120,
    gap: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#29A66C",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    lineHeight: 31,
    color: "#1A7048",
  },
  progressSection: {
    gap: 16,
  },
  summaryText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#28363E",
  },
  summaryBold: {
    fontFamily: "Montserrat_700Bold",
    color: "#28363E",
  },
  goalHint: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#28363E",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  historyTitle: {
    flex: 1,
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 22,
    color: "#1A7048",
  },
  exportLink: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#628397",
    textDecorationLine: "underline",
  },
  list: {
    gap: 16,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    color: "#141B1F",
    textAlign: "center",
  },
  emptyMessage: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4E6879",
    textAlign: "center",
  },
});
