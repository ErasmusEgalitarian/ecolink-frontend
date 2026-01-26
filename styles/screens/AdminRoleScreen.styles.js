import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 12,
  },
  errorText: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    color: "red",
    fontSize: 16,
  },
  roleBadge: {
    backgroundColor: "#007bff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  roleBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
