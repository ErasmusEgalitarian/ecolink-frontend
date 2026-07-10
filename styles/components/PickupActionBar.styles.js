import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  button: {
    backgroundColor: "#29A66C",
    borderRadius: 12,
    minHeight: 53,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#28363E",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 6,
  },
  buttonSecondary: {
    backgroundColor: "#FDFEFF",
    borderWidth: 2,
    borderColor: "#29A66C",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDanger: {
    backgroundColor: "#FDFEFF",
    borderWidth: 1,
    borderColor: "#D62B25",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 20,
    color: "#FDFEFF",
  },
  buttonTextSecondary: {
    color: "#28363E",
  },
  buttonTextDanger: {
    color: "#D62B25",
  },
});
