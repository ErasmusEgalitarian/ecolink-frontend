import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  mediaItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
    overflow: "hidden",
  },
  mediaImage: {
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#AFD34D",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  mediaVideo: {
    width: "100%",
    height: screenWidth * 0.56,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
