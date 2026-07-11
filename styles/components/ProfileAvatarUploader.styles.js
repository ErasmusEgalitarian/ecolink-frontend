import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  avatarButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    position: "relative",
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#E8F5E9",
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#29A66C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  helperText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  errorText: {
    fontSize: 13,
    color: "#E63946",
    textAlign: "center",
  },
});
