import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    lineHeight: 21,
    color: "#141B1F",
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  trackColumn: {
    width: 16,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: "#70A31F",
    borderColor: "#70A31F",
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: 28,
    backgroundColor: "#B5E8D0",
    marginVertical: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
    gap: 4,
  },
  contentLast: {
    paddingBottom: 0,
  },
  stepLabel: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    lineHeight: 18,
    color: "#141B1F",
  },
  stepDate: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#4E6879",
  },
  stepMeta: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    lineHeight: 16,
    color: "#28363E",
  },
});
