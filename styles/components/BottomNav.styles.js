import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});
