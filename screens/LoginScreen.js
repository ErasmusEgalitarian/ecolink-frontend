import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "../config/api";
import API_BASE_URL from "../config/api";
import { styles } from "../styles/screens/LoginScreen.styles";

const LoginScreen = ({ onLogin }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    // Limpar erros anteriores
    setEmailError("");
    setPasswordError("");

    // Validar email
    if (!email.trim()) {
      setEmailError(t("Login.emailRequired"));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t("Login.emailInvalid"));
      isValid = false;
    }

    // Validar senha
    if (!password.trim()) {
      setPasswordError(t("Login.passwordRequired"));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t("Login.passwordTooShort"));
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    // Validar formulário antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting login to:", AUTH_ENDPOINTS.LOGIN);
      console.log("With credentials:", { email, password: "***" });

      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Login Response Data:", data);

      if (response.ok) {
        const userId = data.user?.id;
        const token = data.token;

        if (!userId || !token) {
          throw new Error(
            "Invalid response from server: Missing user ID or token",
          );
        }

        // Salvar token temporariamente para buscar o perfil completo
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("authToken", token);

        // Buscar perfil completo do usuário para obter o role correto
        console.log("🔍 [Login] Fetching user profile to get correct role...");
        try {
          const profileResponse = await fetch(USER_ENDPOINTS.ME, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userRole = profileData.data?.roleId?.name || "User";

            console.log("🔍 [Login] Profile data:", profileData.data);
            console.log("✅ [Login] Correct userRole from profile:", userRole);

            await AsyncStorage.setItem("userRole", userRole);
          } else {
            // Fallback: tentar extrair do login response
            const userRole =
              data.user?.roleId?.name || data.user?.role || "User";
            console.log(
              "⚠️ [Login] Using fallback role from login response:",
              userRole,
            );
            await AsyncStorage.setItem("userRole", userRole);
          }
        } catch (profileError) {
          console.error("⚠️ [Login] Error fetching profile:", profileError);
          // Fallback: usar role do login response
          const userRole = data.user?.roleId?.name || data.user?.role || "User";
          await AsyncStorage.setItem("userRole", userRole);
        }

        console.log("✅ [Login] Login completed successfully");

        onLogin(token);
        Alert.alert(t("Login.successTitle"), t("Login.successMessage"));
      } else {
        // Tratar erro 400 (Bad Request)
        console.error(
          "Login failed with status:",
          response.status,
          "Data:",
          data,
        );

        // Limpar senha
        setPassword("");

        if (response.status === 400) {
          // Bad Request - dados inválidos
          if (data.message?.toLowerCase().includes("email")) {
            setEmailError(data.message || t("Login.emailNotFound"));
          } else if (
            data.message?.toLowerCase().includes("password") ||
            data.message?.toLowerCase().includes("senha")
          ) {
            setPasswordError(data.message || t("Login.passwordIncorrect"));
          } else {
            Alert.alert(
              t("Login.errorTitle"),
              data.message || t("Login.invalidCredentials"),
            );
          }
        } else if (response.status === 404) {
          setEmailError(t("Login.emailNotFound"));
        } else if (response.status === 401) {
          setPasswordError(t("Login.passwordIncorrect"));
        } else {
          Alert.alert(
            t("Login.errorTitle"),
            data.message || t("Login.invalidCredentials"),
          );
        }
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (
        error.message.includes("Network request failed") ||
        error.message.includes("Failed to fetch")
      ) {
        Alert.alert(
          t("Login.errorTitle"),
          `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API_BASE_URL}`,
        );
      } else {
        Alert.alert(t("Login.errorTitle"), t("Login.connectionError"));
      }
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
                emailError && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailError ? "#E63946" : "#666"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                placeholder={t("Login.emailPlaceholder")}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* Campo Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("Login.passwordLabel")}</Text>
            <View
              style={[
                styles.inputWrapper,
                passwordFocused && styles.inputWrapperFocused,
                passwordError && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordError ? "#E63946" : "#666"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError("");
                }}
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
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
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

export default LoginScreen;
