import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#2C3E50",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: "#95D5B2",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(82, 183, 136, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
  },
  statusOverlay: {
    flex: 1,
    backgroundColor: "#607D8B",
    justifyContent: "center",
    alignItems: "center",
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
  },
});
