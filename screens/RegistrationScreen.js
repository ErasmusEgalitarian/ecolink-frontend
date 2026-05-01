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

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-]).+$/;

const RegistrationScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cpf, setCpf] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados de foco para cada campo
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [cpfFocused, setCpfFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);

  // Estados de erro para cada campo
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [addressError, setAddressError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const validateCpf = (cpfValue) => {
    const digits = cpfValue.replace(/\D/g, "");
    if (!/^\d{11}$/.test(digits)) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits.charAt(i), 10) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit >= 10) checkDigit = 0;
    if (checkDigit !== parseInt(digits.charAt(9), 10)) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(digits.charAt(i), 10) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit >= 10) checkDigit = 0;

    return checkDigit === parseInt(digits.charAt(10), 10);
  };

  const applyServerErrors = (errors = []) => {
    let handled = false;

    errors.forEach(({ field, message }) => {
      if (field === "username") {
        setUsernameError(message);
        handled = true;
      }
      if (field === "email") {
        setEmailError(message);
        handled = true;
      }
      if (field === "password") {
        setPasswordError(message);
        handled = true;
      }
      if (field === "phone") {
        setPhoneError(message);
        handled = true;
      }
      if (field === "cpf") {
        setCpfError(message);
        handled = true;
      }
      if (field === "address") {
        setAddressError(message);
        handled = true;
      }
    });

    return handled;
  };

  const validateForm = () => {
    let isValid = true;

    // Limpar erros anteriores
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setPhoneError("");
    setCpfError("");
    setAddressError("");

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
    } else if (password.length < 8) {
      setPasswordError(t("Register.passwordTooShort"));
      isValid = false;
    } else if (password.length > 24) {
      setPasswordError(t("Register.passwordTooLong"));
      isValid = false;
    } else if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(t("Register.passwordInvalid"));
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

    // Validar CPF
    if (!cpf.trim()) {
      setCpfError(t("Register.cpfRequired"));
      isValid = false;
    } else if (!validateCpf(cpf)) {
      setCpfError(t("Register.cpfInvalid"));
      isValid = false;
    }

    // Validar endereço
    if (!address.trim()) {
      setAddressError(t("Register.addressRequired"));
      isValid = false;
    } else if (address.trim().length < 5) {
      setAddressError(t("Register.addressTooShort"));
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
      const phone = phoneNumber.replace(/\D/g, "");
      const cleanCpf = cpf.replace(/\D/g, "");

      console.log("Attempting registration to:", AUTH_ENDPOINTS.REGISTER);
      console.log("With data:", {
        username,
        email,
        phone,
        cpf: "***",
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
          phone,
          cpf: cleanCpf,
          address: address.trim(),
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

        if (data.errors?.length && applyServerErrors(data.errors)) {
          return;
        }

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
          } else if (data.message?.toLowerCase().includes("cpf")) {
            setCpfError(data.message);
          } else if (
            data.message?.toLowerCase().includes("password") ||
            data.message?.toLowerCase().includes("senha")
          ) {
            setPasswordError(data.message);
          } else if (
            data.message?.toLowerCase().includes("address") ||
            data.message?.toLowerCase().includes("endereço")
          ) {
            setAddressError(data.message);
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

          {/* Campo CPF */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("Register.cpfLabel")}</Text>
            <View
              style={[
                styles.inputWrapper,
                cpfFocused && styles.inputWrapperFocused,
                cpfError && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="card-outline"
                size={20}
                color={cpfError ? "#E63946" : "#666"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={cpf}
                onChangeText={(text) => {
                  setCpf(text);
                  if (cpfError) setCpfError("");
                }}
                placeholder={t("Register.cpfPlaceholder")}
                placeholderTextColor="#999"
                keyboardType="number-pad"
                editable={!loading}
                onFocus={() => setCpfFocused(true)}
                onBlur={() => setCpfFocused(false)}
              />
            </View>
            {cpfError ? (
              <Text style={styles.errorText}>{cpfError}</Text>
            ) : null}
          </View>

          {/* Campo Endereço */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("Register.addressLabel")}</Text>
            <View
              style={[
                styles.inputWrapper,
                addressFocused && styles.inputWrapperFocused,
                addressError && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={addressError ? "#E63946" : "#666"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (addressError) setAddressError("");
                }}
                placeholder={t("Register.addressPlaceholder")}
                placeholderTextColor="#999"
                autoCapitalize="words"
                editable={!loading}
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
              />
            </View>
            {addressError ? (
              <Text style={styles.errorText}>{addressError}</Text>
            ) : null}
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
