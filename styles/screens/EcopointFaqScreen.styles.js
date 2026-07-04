import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFFFD",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 32,
    paddingBottom: 120,
    gap: 40,
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
    marginTop: -16,
  },
  sections: {
    gap: 48,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
    lineHeight: 23,
  },
  sectionBody: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    lineHeight: 22,
    color: "#141B1F",
  },
  sectionBodyBold: {
    fontFamily: "Montserrat_700Bold",
    color: "#141B1F",
  },
});
