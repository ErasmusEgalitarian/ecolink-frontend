import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { AUTH_ENDPOINTS } from "../config/api";
import AuthScreenShell from "../components/auth/AuthScreenShell";
import AuthTextField from "../components/auth/AuthTextField";
import { authColors } from "../theme/authTheme";
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

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t("Register.successTitle"), t("Register.successMessage"));
        navigation.navigate("Login");
      } else {
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

  const loginFooter = (
    <View style={styles.loginContainer}>
      <Text style={styles.loginText}>{t("Register.hasAccount")}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>{t("Register.backToLogin")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AuthScreenShell footer={loginFooter}>
      <Text style={styles.title}>{t("Register.title")}</Text>
      <Text style={styles.subtitle}>{t("Register.subtitle")}</Text>

      <AuthTextField
        label={t("Register.usernameLabel")}
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (usernameError) setUsernameError("");
        }}
        placeholder={t("Register.usernamePlaceholder")}
        iconName="person-outline"
        error={usernameError}
        editable={!loading}
        autoCapitalize="words"
        focused={usernameFocused}
        onFocus={() => setUsernameFocused(true)}
        onBlur={() => setUsernameFocused(false)}
      />

      <AuthTextField
        label={t("Register.emailLabel")}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) setEmailError("");
        }}
        placeholder={t("Register.emailPlaceholder")}
        iconName="mail-outline"
        error={emailError}
        editable={!loading}
        keyboardType="email-address"
        focused={emailFocused}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
      />

      <AuthTextField
        label={t("Register.passwordLabel")}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError("");
        }}
        placeholder={t("Register.passwordPlaceholder")}
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

      <AuthTextField
        label={t("Register.phoneLabel")}
        value={phoneNumber}
        onChangeText={(text) => {
          setPhoneNumber(text);
          if (phoneError) setPhoneError("");
        }}
        placeholder={t("Register.phonePlaceholder")}
        iconName="call-outline"
        error={phoneError}
        editable={!loading}
        keyboardType="phone-pad"
        focused={phoneFocused}
        onFocus={() => setPhoneFocused(true)}
        onBlur={() => setPhoneFocused(false)}
      />

      <AuthTextField
        label={t("Register.cpfLabel")}
        value={cpf}
        onChangeText={(text) => {
          setCpf(text);
          if (cpfError) setCpfError("");
        }}
        placeholder={t("Register.cpfPlaceholder")}
        iconName="card-outline"
        error={cpfError}
        editable={!loading}
        keyboardType="number-pad"
        focused={cpfFocused}
        onFocus={() => setCpfFocused(true)}
        onBlur={() => setCpfFocused(false)}
      />

      <AuthTextField
        label={t("Register.addressLabel")}
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          if (addressError) setAddressError("");
        }}
        placeholder={t("Register.addressPlaceholder")}
        iconName="location-outline"
        error={addressError}
        editable={!loading}
        autoCapitalize="words"
        focused={addressFocused}
        onFocus={() => setAddressFocused(true)}
        onBlur={() => setAddressFocused(false)}
      />

      <TouchableOpacity
        style={[
          styles.registerButton,
          loading && styles.registerButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size="small" color={authColors.white} />
        ) : (
          <Text style={styles.registerButtonText}>
            {t("Register.registerButton")}
          </Text>
        )}
      </TouchableOpacity>
    </AuthScreenShell>
  );
};

export default RegistrationScreen;
