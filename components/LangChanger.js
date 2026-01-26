import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/components/LangChanger.styles";

const LangChanger = () => {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");

  // Language toggler
  const toggleLanguage = () => {
    const newLang = isEnglish ? "pt" : "en";
    i18n.changeLanguage(newLang);
    setIsEnglish(!isEnglish);
  };

  // Switch component to change language
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isEnglish ? "EN" : "PT"}</Text>
      <Switch
        onValueChange={toggleLanguage}
        value={isEnglish}
        trackColor={{ false: "#0c3a9c", true: "#81b0ff" }}
        thumbColor={isEnglish ? "#86898f" : "#f4f3f4"}
      />
    </View>
  );
};

export default LangChanger;
