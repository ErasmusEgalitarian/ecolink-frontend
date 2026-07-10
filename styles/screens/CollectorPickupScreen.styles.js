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
    paddingBottom: 40,
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
  headerBlock: {
    gap: 8,
  },
  locationName: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    lineHeight: 31,
    color: "#1A7048",
  },
  ecopointLabel: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 21,
    color: "#141B1F",
  },
  address: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4E6879",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  ecopointStatus: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
  },
  loadingContainer: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  completedBanner: {
    backgroundColor: "#E8F5D8",
    borderRadius: 12,
    padding: 16,
  },
  completedBannerText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: "#1A7048",
    textAlign: "center",
  },
  cancelledBanner: {
    backgroundColor: "#FFF4E5",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0D59A",
  },
  cancelledBannerText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 13,
    lineHeight: 19,
    color: "#7A5A00",
  },
});
