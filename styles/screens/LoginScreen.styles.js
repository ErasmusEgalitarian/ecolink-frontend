import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: "#2D6A4F",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
  },
  logo: {
    width: 180,
    height: 60,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D6A4F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    transition: "border-color 0.2s",
  },
  inputWrapperFocused: {
    borderColor: "#52B788",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
  },
  inputWrapperError: {
    borderColor: "#E63946",
    borderWidth: 2,
    backgroundColor: "#FFF5F5",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 12,
    color: "#E63946",
    marginTop: 5,
    marginLeft: 5,
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#2D6A4F",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#52B788",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: "#95D5B2",
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D6A4F",
    textDecorationLine: "underline",
  },
});
