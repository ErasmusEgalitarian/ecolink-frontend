import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
    // Web responsiveness
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    alignItems: "center",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  optionButtonActive: {
    backgroundColor: "#52B788",
    borderColor: "#52B788",
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    flex: 1,
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    // Shadow
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E63946",
    marginLeft: 8,
  },
});
