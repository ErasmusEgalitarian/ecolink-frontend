import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/components/LangChanger.styles";
import {
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
} from "../utils/language";

const LangChanger = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    normalizeLanguage(i18n.language),
  );

  useEffect(() => {
    const loadSavedLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (!savedLanguage) {
        return;
      }

      const normalizedLanguage = normalizeLanguage(savedLanguage);
      await i18n.changeLanguage(normalizedLanguage);
      setCurrentLanguage(normalizedLanguage);
    };

    loadSavedLanguage();
  }, [i18n]);

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";

    await i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleLanguage}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Alterar idioma"
      >
        <Ionicons name="language-outline" size={22} color="#14213D" />
        <Text style={styles.label}>{currentLanguage.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LangChanger;
