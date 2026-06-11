import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AUTH_ENDPOINTS } from "../config/api";
import API_BASE_URL from "../config/api";
import AuthScreenShell from "../components/auth/AuthScreenShell";
import AuthTextField from "../components/auth/AuthTextField";
import VerificationCodeCard from "../components/auth/VerificationCodeCard";
import { authColors } from "../theme/authTheme";
import { styles } from "../styles/screens/LoginScreen.styles";
import { persistAuthSession } from "../utils/authSession";

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
  const [verificationEmail, setVerificationEmail] = useState("");

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);

    if (email.trim() && !validateEmail(email)) {
      setEmailError(t("Login.emailInvalid"));
    }
  };

  const validateForm = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError(t("Login.emailRequired"));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t("Login.emailInvalid"));
      isValid = false;
    }

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
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = await persistAuthSession(data);
        onLogin(token);
        Alert.alert(t("Login.successTitle"), t("Login.successMessage"));
      } else {
        setPassword("");

        if (response.status === 403 && data.code === "EMAIL_UNVERIFIED") {
          setVerificationEmail(normalizedEmail);
          return;
        }

        if (response.status === 400) {
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

  const handleVerificationComplete = async (authData) => {
    if (!authData?.token) {
      Alert.alert(
        t("EmailVerification.verifiedTitle"),
        t("EmailVerification.verifiedLoginMessage"),
      );
      setVerificationEmail("");
      setPassword("");
      return;
    }

    const token = await persistAuthSession(authData);
    Alert.alert(
      t("EmailVerification.verifiedTitle"),
      t("EmailVerification.verifiedLoginMessage"),
    );
    onLogin(token);
  };

  const registerFooter = (
    <View style={styles.registerContainer}>
      <Text style={styles.registerText}>{t("Login.noAccount")}</Text>
      <TouchableOpacity onPress={handleNavigateToRegister}>
        <Text style={styles.registerLink}>{t("Login.createAccount")}</Text>
      </TouchableOpacity>
    </View>
  );

  if (verificationEmail) {
    return (
      <AuthScreenShell footer={registerFooter}>
        <VerificationCodeCard
          email={verificationEmail}
          onVerified={handleVerificationComplete}
        />
      </AuthScreenShell>
    );
  }

  return (
    <AuthScreenShell footer={registerFooter}>
      <Text style={styles.title}>{t("Login.title")}</Text>
      <Text style={styles.subtitle}>{t("Login.subtitle")}</Text>

      <AuthTextField
        label={t("Login.emailLabel")}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) setEmailError("");
        }}
        placeholder={t("Login.emailPlaceholder")}
        iconName="person-outline"
        error={emailError}
        editable={!loading}
        keyboardType="email-address"
        focused={emailFocused}
        onFocus={() => setEmailFocused(true)}
        onBlur={handleEmailBlur}
      />

      <AuthTextField
        label={t("Login.passwordLabel")}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError("");
        }}
        placeholder={t("Login.passwordPlaceholder")}
        iconName="lock-closed-outline"
        error={passwordError}
        editable={!loading}
        secureTextEntry={!showPassword}
        showToggle
        visible={showPassword}
        onToggleVisibility={() => setShowPassword(!showPassword)}
        focused={passwordFocused}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
      />

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>
          {t("Login.forgotPassword")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size="small" color={authColors.white} />
        ) : (
          <Text style={styles.loginButtonText}>{t("Login.loginButton")}</Text>
        )}
      </TouchableOpacity>
    </AuthScreenShell>
  );
};

export default LoginScreen;
