import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6FFFB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 32,
    paddingBottom: 120,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    lineHeight: 31,
    color: "#1A7048",
  },
  subtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4E6879",
  },
  sectionTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 22,
    color: "#1A7048",
  },
  section: {
    gap: 12,
  },
  editorFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  editorFilterChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FDFEFF",
    borderWidth: 1,
    borderColor: "#B5E8D0",
  },
  editorFilterChipActive: {
    backgroundColor: "#29A66C",
    borderColor: "#29A66C",
  },
  editorFilterText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    color: "#1A7048",
  },
  editorFilterTextActive: {
    color: "#FDFEFF",
  },
  featuredList: {
    gap: 12,
    paddingRight: 8,
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
  fab: {
    position: "absolute",
    right: 32,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#29A66C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
});
