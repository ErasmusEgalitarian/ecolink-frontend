import { StyleSheet } from "react-native";
import { authColors } from "../../theme/authTheme";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: authColors.pageBackground,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: authColors.pageBackground,
  },
  header: {
    backgroundColor: authColors.pageBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    backgroundColor: authColors.sheetBackground,
    overflow: "hidden",
  },
  sheetInner: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingTop: 32,
    paddingBottom: 8,
  },
  footer: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    marginTop: "auto",
    backgroundColor: authColors.sheetBackground,
    alignItems: "center",
  },
});
