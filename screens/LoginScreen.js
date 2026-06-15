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
import { api, AUTH_ROUTES, isApiConnectionError } from "../config/api";
import AuthScreenShell from "../components/auth/AuthScreenShell";
import AuthTextField from "../components/auth/AuthTextField";
import VerificationCodeCard from "../components/auth/VerificationCodeCard";
import ConnectionErrorCard from "../components/ConnectionErrorCard";
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
  const [formError, setFormError] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [connectionError, setConnectionError] = useState(false);

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
    setFormError("");

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

  const showInvalidCredentials = () => {
    setEmailError("");
    setFormError("");
    setPasswordError(t("Login.invalidCredentials"));
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setConnectionError(false);
    setFormError("");

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const response = await api.post(
        AUTH_ROUTES.LOGIN,
        {
          email: normalizedEmail,
          password,
        },
        {
          headers: { Accept: "application/json" },
        },
      );

      const token = await persistAuthSession(response.data);
      onLogin(token);
      Alert.alert(t("Login.successTitle"), t("Login.successMessage"));
    } catch (error) {
      const data = error.data || {};

      if (isApiConnectionError(error)) {
        setConnectionError(true);
        return;
      }

      if (error.status === 429 || data.code === "LOGIN_RATE_LIMIT_EXCEEDED") {
        setEmailError("");
        setPasswordError("");
        setFormError(t("Login.tooManyAttempts"));
        return;
      }

      setPassword("");
      showInvalidCredentials();
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
          if (formError) setFormError("");
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
          if (formError) setFormError("");
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

      {connectionError ? (
        <ConnectionErrorCard onRetry={handleLogin} />
      ) : null}

      {formError ? <Text style={styles.formError}>{formError}</Text> : null}

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
