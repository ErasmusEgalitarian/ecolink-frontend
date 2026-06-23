import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6FFFB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 120,
  },

  // ─── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerGreeting: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#4E6879",
    textDecorationLine: "none",
  },
  headerName: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    lineHeight: 26,
    color: "#141B1F",
    textDecorationLine: "none",
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

  // ─── Progress Card ──────────────────────────────────────────────────────────
  progressCard: {
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    paddingTop: 16,
    paddingBottom: 0,
    paddingLeft: 25,
    paddingRight: 16,
    marginBottom: 24,
    justifyContent: "center",
    overflow: "visible",
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 4,
  },
  progressCardTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 21,
    color: "#141B1F",
    marginBottom: 16,
    textDecorationLine: "none",
  },
  progressCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressLeft: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: 12,
    paddingBottom: 16,
  },
  percentageText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 38,
    lineHeight: 44,
    color: "#1A7048",
    textDecorationLine: "none",
  },
  motivationalText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 10,
    lineHeight: 13,
    color: "#4E6879",
    textDecorationLine: "none",
  },

  // ─── Gauge ──────────────────────────────────────────────────────────────────
  gaugeContainer: {
    width: 160,
    height: 100,
    overflow: "visible",
  },

  // ─── Quick-access cards ─────────────────────────────────────────────────────
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 32,
    marginBottom: 16,
  },
  quickCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 4,
    gap: 10,
  },
  quickCardIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#B5E8D0",
    justifyContent: "center",
    alignItems: "center",
  },
  quickCardText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 21,
    color: "#141B1F",
    textDecorationLine: "none",
  },

  // ─── Bottom CTA (fixed-width, right-aligned per Figma) ─────────────────────
  donateButton: {
    position: "absolute",
    bottom: 36,
    width: 192,
    maxWidth: "55%",
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
