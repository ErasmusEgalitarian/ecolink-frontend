import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { styles } from "../../styles/components/ProfileStubScreen.styles";

const ProfileStubScreen = ({ navigation, titleKey, messageKey = "Profile.stubMessage" }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            accessibilityLabel={t("Profile.back")}
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{t(titleKey)}</Text>
        <View style={styles.stubCard}>
          <Ionicons name="construct-outline" size={32} color="#52B788" />
          <Text style={styles.stubMessage}>{t(messageKey)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileStubScreen;
