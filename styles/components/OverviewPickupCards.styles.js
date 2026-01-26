import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginBottom: 12,
    width: "100%",
    height: 84,
    borderRadius: 6,
    elevation: 3,
    alignSelf: "center",
    justifyContent: "center",
    padding: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 60,
    height: 60,
    marginRight: 12,
    backgroundColor: "rgba(162,162,162,0.84)",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTXTContainer: {
    flexDirection: "column",
  },
  cardTXT: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  cardNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "medium",
    color: "#999999",
  },
});
