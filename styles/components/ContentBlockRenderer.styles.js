import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heading: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    lineHeight: 24,
    color: "#1A7048",
  },
  paragraph: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#141B1F",
  },
  quote: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 15,
    lineHeight: 22,
    color: "#28363E",
    backgroundColor: "#E2F3EC",
    borderLeftWidth: 4,
    borderLeftColor: "#29A66C",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  list: {
    gap: 8,
  },
  listItemRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#29A66C",
    marginTop: 8,
  },
  listItem: {
    flex: 1,
    fontFamily: "Montserrat_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "#141B1F",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#E2F3EC",
  },
  caption: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#628397",
    marginTop: 8,
  },
  videoWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#141B1F",
    minHeight: 200,
  },
  videoWeb: {
    width: "100%",
    height: 220,
    border: 0,
  },
  videoFallback: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 20,
    backgroundColor: "#E2F3EC",
    borderRadius: 12,
  },
  videoFallbackText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    lineHeight: 20,
    color: "#1A7048",
    textAlign: "center",
  },
  videoButton: {
    backgroundColor: "#29A66C",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  videoButtonText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 13,
    color: "#FDFEFF",
  },
});
