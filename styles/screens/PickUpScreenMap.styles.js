import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    marginVertical: 12,
    marginHorizontal: 32,
    borderRadius: 12,
    overflow: "hidden",
  },
  mapComponent: {
    flex: 1,
    borderRadius: 12,
  },
  finishButton: {
    position: "absolute",
    backgroundColor: "#AFD34D",
    borderRadius: 25,
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    height: 48,
    bottom: 12,
  },
  buttonText: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
