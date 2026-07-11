import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6FFFB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 32,
    paddingBottom: 120,
    gap: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#29A66C",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    lineHeight: 31,
    color: "#1A7048",
  },
  sectionLabel: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: "#1A7048",
  },
  input: {
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B5E8D0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#141B1F",
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FDFEFF",
    borderWidth: 1,
    borderColor: "#B5E8D0",
  },
  chipActive: {
    backgroundColor: "#29A66C",
    borderColor: "#29A66C",
  },
  chipText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    color: "#1A7048",
  },
  chipTextActive: {
    color: "#FDFEFF",
  },
  blockCard: {
    backgroundColor: "#FDFEFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E2F3EC",
  },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  blockActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moveButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#E2F3EC",
    alignItems: "center",
    justifyContent: "center",
  },
  moveButtonDisabled: {
    opacity: 0.5,
  },
  blockType: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 13,
    color: "#29A66C",
  },
  removeBlock: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    color: "#E63946",
  },
  addBlockRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addBlockButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#E2F3EC",
  },
  addBlockText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
    color: "#1A7048",
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#29A66C",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 15,
    color: "#FDFEFF",
  },
  secondaryButton: {
    backgroundColor: "#FDFEFF",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#29A66C",
  },
  secondaryButtonText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 15,
    color: "#1A7048",
  },
  errorText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 13,
    color: "#E63946",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
