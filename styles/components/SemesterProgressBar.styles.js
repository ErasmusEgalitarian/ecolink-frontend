import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 31,
    borderRadius: 15.5,
    backgroundColor: "#B5E8D0",
    overflow: "hidden",
    justifyContent: "center",
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    minWidth: 31,
    borderRadius: 15.5,
    backgroundColor: "#29A66C",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 12,
  },
  percentText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: "#FDFEFF",
  },
  percentTextOutside: {
    position: "absolute",
    right: 12,
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: "#1A7048",
  },
});
