import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    aspectRatio: 1,
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  name: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    lineHeight: 26,
    color: "#1A7048",
  },
  footer: {
    gap: 4,
  },
  amount: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 13,
    lineHeight: 18,
    color: "#28363E",
  },
  percentage: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    lineHeight: 18,
    color: "#29A66C",
  },
});
