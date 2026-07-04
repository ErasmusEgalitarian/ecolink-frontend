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
    paddingBottom: 48,
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
    marginTop: -8,
  },
  divider: {
    height: 1,
    backgroundColor: "#D8E8E0",
    marginTop: -8,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 326 / 220,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#E2F3EC",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2F3EC",
  },
  routeButton: {
    width: "100%",
    height: 53,
    backgroundColor: "#29A66C",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  routeButtonText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    lineHeight: 23,
    color: "#FDFEFF",
  },
  detailsSection: {
    gap: 20,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#809CAD",
  },
  detailValue: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    color: "#28363E",
  },
  ecopointsSection: {
    gap: 12,
  },
  ecopointsList: {
    gap: 12,
  },
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
  emptyTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    lineHeight: 24,
    color: "#1A7048",
    textAlign: "center",
  },
  connectionCard: {
    marginTop: 24,
  },
});
