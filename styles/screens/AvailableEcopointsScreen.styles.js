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
    paddingBottom: 180,
    gap: 40,
  },

  // ─── Top bar ────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  helpButton: {
    width: 33,
    height: 32,
    borderRadius: 85,
    backgroundColor: "#B5E8D0",
    justifyContent: "center",
    alignItems: "center",
  },
  helpButtonText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 21,
    color: "#809CAD",
    textDecorationLine: "none",
  },

  // ─── Title ──────────────────────────────────────────────────────────────────
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    lineHeight: 31,
    color: "#1A7048",
    textDecorationLine: "none",
    marginTop: -16,
  },

  // ─── Sections ─────────────────────────────────────────────────────────────--
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
    lineHeight: 23,
    color: "#29A66C",
    textDecorationLine: "none",
  },

  // ─── States ───────────────────────────────────────────────────────────────--
  centerState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4E6879",
    textAlign: "center",
  },
  connectionCard: {
    marginTop: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 16,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#B5E8D0",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    lineHeight: 26,
    color: "#1A7048",
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4E6879",
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 8,
    backgroundColor: "#29A66C",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyButtonText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 21,
    color: "#FDFEFF",
  },

  // ─── Floating CTA ─────────────────────────────────────────────────────────--
  donateButton: {
    position: "absolute",
    right: 32,
    bottom: 36,
    width: 192,
    maxWidth: "60%",
    height: 53,
    backgroundColor: "#29A66C",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 6,
  },
  donateButtonText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    lineHeight: 23,
    color: "#FDFEFF",
    textDecorationLine: "none",
  },
});
