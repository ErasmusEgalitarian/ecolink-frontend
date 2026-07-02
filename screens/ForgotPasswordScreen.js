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
import ConnectionErrorCard from "../components/ConnectionErrorCard";
import { authColors } from "../theme/authTheme";
import { styles } from "../styles/screens/LoginScreen.styles"; // Usando os mesmos estilos

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [formError, setFormError] = useState("");

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  // --- Passo 1: Solicitar o envio do Token ---
  const handleRequestReset = async () => {
    setFormError("");
    setConnectionError(false);

    if (!email.trim() || !validateEmail(email)) {
      setFormError("Insira um e-mail válido.");
      return;
    }

    setLoading(true);
    try {
      // O seu back-end espera { email }
      await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email: email.trim().toLowerCase() });
      
      setStep(2);
      Alert.alert("E-mail Enviado", "Verifique sua caixa de entrada e copie o token recebido.");
    } catch (error) {
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setFormError(error.message || "Erro ao solicitar recuperação.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Passo 2: Enviar o Token e a Nova Senha ---
  const handleResetPassword = async () => {
    setFormError("");
    setConnectionError(false);

    if (!token.trim() || newPassword.length < 6) {
      setFormError("Cole o token e crie uma senha de no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // O seu back-end espera { token, password }
      await api.post(AUTH_ROUTES.RESET_PASSWORD, { 
        token: token.trim(),
        password: newPassword 
      });
      
      Alert.alert("Sucesso!", "Sua senha foi redefinida. Faça login novamente.");
      navigation.navigate("Login"); 
    } catch (error) {
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setFormError(error.message || "Token inválido ou expirado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell 
      footer={
        <View style={styles.registerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.registerLink}>Voltar para o Login</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        {step === 1 
          ? "Digite seu e-mail para receber o link de recuperação." 
          : "Cole o token recebido por e-mail e crie sua nova senha."}
      </Text>

      {step === 1 && (
        <AuthTextField
          label="E-mail"
          value={email}
          onChangeText={(text) => { setEmail(text); setFormError(""); }}
          placeholder="seu@email.com"
          iconName="mail-outline"
          editable={!loading}
          keyboardType="email-address"
        />
      )}

      {step === 2 && (
        <>
          <AuthTextField
            label="Token de Recuperação"
            value={token}
            onChangeText={(text) => { setToken(text); setFormError(""); }}
            placeholder="Cole o token recebido"
            iconName="key-outline"
            editable={!loading}
          />
          <AuthTextField
            label="Nova Senha"
            value={newPassword}
            onChangeText={(text) => { setNewPassword(text); setFormError(""); }}
            placeholder="No mínimo 6 caracteres"
            iconName="lock-closed-outline"
            editable={!loading}
            secureTextEntry={!showPassword}
            showToggle
            visible={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
          />
          <TouchableOpacity 
            style={{ marginTop: 15, alignItems: 'center' }} 
            onPress={() => {
                setStep(1);
                setToken("");
                setNewPassword("");
                setFormError("");
            }}
          >
            <Text style={{ color: authColors.primary, fontWeight: '600' }}>
              O token expirou? Voltar e pedir um novo.
            </Text>
          </TouchableOpacity>
        </>
      )}

      {connectionError && <ConnectionErrorCard onRetry={step === 1 ? handleRequestReset : handleResetPassword} />}
      {formError ? <Text style={styles.formError}>{formError}</Text> : null}

      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled, { marginTop: 20 }]}
        onPress={step === 1 ? handleRequestReset : handleResetPassword}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size="small" color={authColors.white} />
        ) : (
          <Text style={styles.loginButtonText}>
            {step === 1 ? "Receber Token" : "Alterar Senha"}
          </Text>
        )}
      </TouchableOpacity>
    </AuthScreenShell>
  );
};

export default ForgotPasswordScreen;