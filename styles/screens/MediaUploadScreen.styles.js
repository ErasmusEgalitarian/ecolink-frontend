import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.1,
    paddingTop: height * 0.05,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  pickButton: {
    backgroundColor: "#AFD34D",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 25,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  pickButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  fileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  previewImage: {
    width: width * 0.5,
    height: height * 0.25,
    resizeMode: "contain",
    marginBottom: 10,
    borderRadius: 10,
  },
  fileName: {
    fontSize: width * 0.04,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#AFD34D",
    borderRadius: 10,
    width: "100%",
    marginBottom: 30,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  uploadButton: {
    backgroundColor: "#AFD34D",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.3,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
});
