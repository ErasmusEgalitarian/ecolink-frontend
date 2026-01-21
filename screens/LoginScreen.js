import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = ({ onLogin }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response Data:", data);

      if (response.ok) {
        const userId = data.user?.id;
        const token = data.token;

        if (!userId || !token) {
          throw new Error(
            "Invalid response from server: Missing user ID or token"
          );
        }

        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("authToken", token);

        onLogin(token);
        Alert.alert("Login Successful", "Welcome back!");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.message || error);
      Alert.alert("Login Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header com Logo */}
        <View style={styles.header}>
          <Image
            source={require("../assets/EcoLinkLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Card de Login */}
        <View style={styles.card}>
          <Text style={styles.title}>{t("Login.title")}</Text>
          <Text style={styles.subtitle}>{t("Login.subtitle")}</Text>

          {/* Campo E-mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("Login.emailLabel")}</Text>
            <View
              style={[
                styles.inputWrapper,
                emailFocused && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t("Login.emailPlaceholder")}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Campo Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("Login.passwordLabel")}</Text>
            <View
              style={[
                styles.inputWrapper,
                passwordFocused && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={t("Login.passwordPlaceholder")}
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Link Esqueci minha senha */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              {t("Login.forgotPassword")}
            </Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                {t("Login.loginButton")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Link Criar Conta */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{t("Login.noAccount")}</Text>
            <TouchableOpacity onPress={handleNavigateToRegister}>
              <Text style={styles.registerLink}>
                {t("Login.createAccount")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
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

export default LoginScreen;
