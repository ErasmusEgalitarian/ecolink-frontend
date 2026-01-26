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
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { AUTH_ENDPOINTS } from "../config/api";
import { styles } from "../styles/screens/RegistrationScreen.styles";

const RegistrationScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados de foco para cada campo
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);

  // Estados de erro para cada campo
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const validateForm = () => {
    let isValid = true;

    // Limpar erros anteriores
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setPhoneError("");

    // Validar nome
    if (!username.trim()) {
      setUsernameError(t("Register.usernameRequired"));
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError(t("Register.usernameTooShort"));
      isValid = false;
    }

    // Validar email
    if (!email.trim()) {
      setEmailError(t("Register.emailRequired"));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t("Register.emailInvalid"));
      isValid = false;
    }

    // Validar senha
    if (!password.trim()) {
      setPasswordError(t("Register.passwordRequired"));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t("Register.passwordTooShort"));
      isValid = false;
    }

    // Validar telefone
    if (!phoneNumber.trim()) {
      setPhoneError(t("Register.phoneRequired"));
      isValid = false;
    } else if (!validatePhone(phoneNumber)) {
      setPhoneError(t("Register.phoneInvalid"));
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    // Validar formulário antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting registration to:", AUTH_ENDPOINTS.REGISTER);
      console.log("With data:", {
        username,
        email,
        phoneNumber,
        address,
        password: "***",
      });

      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          phoneNumber,
          address: address || undefined, // Enviar undefined se vazio (campo opcional)
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Registration Response Data:", data);

      if (response.ok) {
        Alert.alert(t("Register.successTitle"), t("Register.successMessage"));
        navigation.navigate("Login");
      } else {
        // Tratar erro 400 (Bad Request)
        console.error(
          "Registration failed with status:",
          response.status,
          "Data:",
          data,
        );

        if (response.status === 400) {
          // Bad Request - dados inválidos
          if (data.message?.toLowerCase().includes("email")) {
            setEmailError(data.message || t("Register.emailExists"));
          } else if (
            data.message?.toLowerCase().includes("username") ||
            data.message?.toLowerCase().includes("nome")
          ) {
            setUsernameError(data.message);
          } else if (
            data.message?.toLowerCase().includes("phone") ||
            data.message?.toLowerCase().includes("telefone")
          ) {
            setPhoneError(data.message);
          } else if (
            data.message?.toLowerCase().includes("password") ||
            data.message?.toLowerCase().includes("senha")
          ) {
            setPasswordError(data.message);
          } else {
            Alert.alert(
              t("Register.errorTitle"),
              data.message || t("Register.errorMessage"),
            );
          }
        } else if (response.status === 409) {
          // Conflito - email já existe
          setEmailError(t("Register.emailExists"));
        } else {
          Alert.alert(
            t("Register.errorTitle"),
            data.message || t("Register.errorMessage"),
          );
        }
      }
    } catch (error) {
      console.error("Registration Error:", error);

      if (
        error.message.includes("Network request failed") ||
        error.message.includes("Failed to fetch")
      ) {
        Alert.alert(
          t("Register.errorTitle"),
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:5000",
        );
      } else {
        Alert.alert(t("Register.errorTitle"), t("Register.connectionError"));
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Image
            source={require("../assets/EcoLinkLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Card de Registro */}
        <View style={styles.card}>
          <Text style={styles.title}>{t("Register.title")}</Text>
          <Text style={styles.subtitle}>{t("Register.subtitle")}</Text>

          {/* Campo Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("Register.usernameLabel")}</Text>
            <View
              style={[
                styles.inputWrapper,
                usernameFocused && styles.inputWrapperFocused,
                usernameError && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={usernameError ? "#E63946" : "#666"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (usernameError) setUsernameError("");
                }}
                placeholder={t("Register.usernamePlaceholder")}
                placeholderTextColor="#999"
                autoCapitalize="words"
                editable={!loading}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
              />
            </View>
            {usernameError ? (
              <Text style={styles.errorText}>{usernameError}</Text>
            ) : null}
          </View>

          {/* Campo E-mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("Register.emailLabel")}</Text>
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
                placeholder={t("Register.emailPlaceholder")}
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
            <Text style={styles.label}>{t("Register.passwordLabel")}</Text>
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
                placeholder={t("Register.passwordPlaceholder")}
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

          {/* Campo Telefone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("Register.phoneLabel")}</Text>
            <View
              style={[
                styles.inputWrapper,
                phoneFocused && styles.inputWrapperFocused,
                phoneError && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={phoneError ? "#E63946" : "#666"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  if (phoneError) setPhoneError("");
                }}
                placeholder={t("Register.phonePlaceholder")}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                editable={!loading}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
              />
            </View>
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}
          </View>

          {/* Campo Endereço */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t("Register.addressLabel")}
              <Text style={styles.optionalLabel}>
                {" "}
                {t("Register.optional")}
              </Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                addressFocused && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder={t("Register.addressPlaceholder")}
                placeholderTextColor="#999"
                autoCapitalize="words"
                editable={!loading}
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
              />
            </View>
          </View>

          {/* Botão Registrar */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>
                {t("Register.registerButton")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Link Voltar para Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t("Register.hasAccount")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>{t("Register.backToLogin")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistrationScreen;
