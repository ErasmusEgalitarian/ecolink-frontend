import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { api, AUTH_ROUTES, isApiConnectionError } from "../../config/api";
import { authColors } from "../../theme/authTheme";
import { styles } from "../../styles/components/VerificationCodeCard.styles";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const sanitizeCode = (value) => value.replace(/\D/g, "").slice(0, CODE_LENGTH);

const VerificationCodeCard = ({ email, onVerified }) => {
  const { t } = useTranslation();
  const [codeDigits, setCodeDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  const code = codeDigits.join("");
  const canVerify = codeDigits.every(Boolean) && !verifying && !resending;
  const canResend = !resending && resendCooldown === 0;

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setResendCooldown((currentCooldown) => Math.max(currentCooldown - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleChangeCode = (value, index) => {
    const sanitizedValue = sanitizeCode(value);

    setError("");
    setSuccessMessage("");

    if (!sanitizedValue) {
      const nextDigits = codeDigits.slice();
      nextDigits[index] = "";
      setCodeDigits(nextDigits);
      return;
    }

    if (sanitizedValue.length > 1) {
      const nextDigits = codeDigits.slice();

      sanitizedValue.split("").forEach((digit, offset) => {
        const targetIndex = index + offset;

        if (targetIndex < CODE_LENGTH) {
          nextDigits[targetIndex] = digit;
        }
      });

      setCodeDigits(nextDigits);
      focusInput(Math.min(index + sanitizedValue.length, CODE_LENGTH - 1));
      return;
    }

    const nextDigits = codeDigits.slice();
    nextDigits[index] = sanitizedValue;
    setCodeDigits(nextDigits);

    if (index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !codeDigits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const startCooldown = (retryAfter) => {
    const retryAfterSeconds = Number(retryAfter);
    setResendCooldown(
      Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
        ? retryAfterSeconds
        : RESEND_COOLDOWN_SECONDS,
    );
  };

  const handleVerifyCode = async () => {
    if (!canVerify) {
      setError(t("EmailVerification.codeRequired"));
      return;
    }

    setVerifying(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.post(
        AUTH_ROUTES.VERIFY_EMAIL,
        { email, code },
        { headers: { Accept: "application/json" } },
      );

      await onVerified?.(response.data);
      return;
    } catch (error) {
      const data = error.data || {};

      if (isApiConnectionError(error)) {
        setError(t("Api.connectionMessage"));
      } else if (data.code === "EMAIL_VERIFICATION_EXPIRED") {
        setError(t("EmailVerification.expiredCode"));
      } else if (data.code === "EMAIL_ALREADY_VERIFIED") {
        await onVerified?.();
      } else {
        setError(data.message || t("EmailVerification.invalidCode"));
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) {
      return;
    }

    setResending(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.post(
        AUTH_ROUTES.RESEND_VERIFICATION_CODE,
        { email },
        { headers: { Accept: "application/json" } },
      );
      const data = response.data || {};

      setCodeDigits(Array(CODE_LENGTH).fill(""));
      focusInput(0);
      setSuccessMessage(t("EmailVerification.resendSuccess"));
      startCooldown(data.retryAfter);
      return;
    } catch (error) {
      const data = error.data || {};

      if (isApiConnectionError(error)) {
        setError(t("Api.connectionMessage"));
      } else if (error.status === 429) {
        startCooldown(data.retryAfter);
        setError(t("EmailVerification.rateLimited"));
      } else if (data.code === "EMAIL_ALREADY_VERIFIED") {
        await onVerified?.();
      } else {
        setError(data.message || t("EmailVerification.resendError"));
      }
    } finally {
      setResending(false);
    }
  };

  const resendLabel =
    resendCooldown > 0
      ? t("EmailVerification.resendCooldown", { seconds: resendCooldown })
      : t("EmailVerification.resendButton");

  return (
    <View>
      <Text style={styles.title}>{t("EmailVerification.title")}</Text>
      <Text style={styles.subtitle}>{t("EmailVerification.subtitle")}</Text>
      <Text style={styles.emailText}>{email}</Text>

      <View style={styles.codeRow}>
        {codeDigits.map((digit, index) => (
          <TextInput
            key={`verification-code-${index}`}
            ref={(inputRef) => {
              inputRefs.current[index] = inputRef;
            }}
            style={[
              styles.codeInput,
              focusedIndex === index && styles.codeInputFocused,
              Boolean(error) && styles.codeInputError,
            ]}
            value={digit}
            onChangeText={(value) => handleChangeCode(value, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            onFocus={() => setFocusedIndex(index)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={CODE_LENGTH}
            editable={!verifying}
            selectTextOnFocus
          />
        ))}
      </View>

      <Text style={styles.helperText}>{t("EmailVerification.helperText")}</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.verifyButton, !canVerify && styles.buttonDisabled]}
        onPress={handleVerifyCode}
        disabled={!canVerify}
        activeOpacity={0.85}
      >
        {verifying ? (
          <ActivityIndicator size="small" color={authColors.white} />
        ) : (
          <Text style={styles.verifyButtonText}>
            {t("EmailVerification.verifyButton")}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.resendButton,
          !canResend && styles.resendButtonDisabled,
        ]}
        onPress={handleResendCode}
        disabled={!canResend}
        activeOpacity={0.85}
      >
        {resending ? (
          <ActivityIndicator size="small" color={authColors.primaryDark} />
        ) : (
          <Text
            style={[
              styles.resendButtonText,
              !canResend && styles.resendButtonTextDisabled,
            ]}
          >
            {resendLabel}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VerificationCodeCard;
