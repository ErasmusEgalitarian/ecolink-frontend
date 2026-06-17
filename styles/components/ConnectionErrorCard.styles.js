import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7C2D12",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#7C2D12",
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#52B788",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 140,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
