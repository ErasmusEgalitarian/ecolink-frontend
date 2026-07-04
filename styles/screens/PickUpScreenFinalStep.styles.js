import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  ecopointLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A7048",
    marginBottom: 16,
  },
  materialsSummary: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  materialChip: {
    backgroundColor: "#E8F8F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  materialChipText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A7048",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#5A5A5A",
  },
});
