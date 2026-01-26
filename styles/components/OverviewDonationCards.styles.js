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
  materialIcon: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  cardTXT: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  cardUserTXT: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D6A4F",
    marginBottom: 4,
  },
  cardSTXT: {
    fontSize: 16,
    fontWeight: "medium",
    color: "#999999",
    marginBottom: 5,
  },
  cardDateTXT: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  cardTXTContainer: {
    flexDirection: "column",
  },
  materialsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  materialsCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
});
