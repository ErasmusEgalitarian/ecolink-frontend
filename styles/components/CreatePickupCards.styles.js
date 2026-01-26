import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  creationContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    width: "100%",
  },
  card: {
    width: "100%",
    height: 84,
    borderRadius: 6,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: "center",
    padding: 12,
  },
  button: {
    position: "absolute",
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.9,
    padding: 24,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 12,
    marginBottom: 24,
  },
  button2: {
    justifyContent: "center",
    align: "center",
    backgroundColor: "#AFD34D",
    borderRadius: 100,
    height: 48,
    width: "47%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  containerPills: {
    flexDirection: "row",
    marginBottom: 12,
  },
  pillButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.185,
    height: height * 0.04,
    backgroundColor: "#F3F3F3",
    borderRadius: 50,
    marginRight: 7,
  },
  pillText: {
    color: "#000",
    fontSize: 15,
  },
  selectedPillText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  selectedPill: {
    backgroundColor: "#FF2E17",
    fontSize: 15,
  },
  modalInputTXT: {
    fontSize: 20,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  modalInputTXTExtra: {
    fontSize: 13,
    marginTop: -12,
    marginBottom: 12,
    alignSelf: "flex-start",
    left: 5,
    color: "#989898",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  cardTXTContainer: {
    flexDirection: "column",
  },
});
