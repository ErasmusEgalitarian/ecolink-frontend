import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation, Trans } from "react-i18next";

import { styles } from "../styles/components/FaqView.styles";

const DEFAULT_TITLE_COLOR = "#1A7048";

const FaqSectionBody = ({ section, translationNamespace }) => {
  const { t } = useTranslation();
  const ns = translationNamespace;

  if (section.bodyKey) {
    return (
      <Text style={styles.sectionBody}>
        <Trans
          i18nKey={`${ns}.${section.bodyKey}`}
          components={{
            bold: <Text style={styles.sectionBodyBold} />,
          }}
        />
      </Text>
    );
  }

  return (
    <Text style={styles.sectionBody}>
      {t(`${ns}.${section.part1Key}`)}
      <Text style={styles.sectionBodyBold}>
        {t(`${ns}.${section.boldKey}`)}
      </Text>
      {t(`${ns}.${section.part2Key}`)}
    </Text>
  );
};

const FaqView = ({
  title,
  titleKey,
  translationNamespace,
  sections = [],
  onBack,
}) => {
  const { t } = useTranslation();
  const resolvedTitle = title ?? (titleKey ? t(`${translationNamespace}.${titleKey}`) : null);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityLabel={t("QRScanner.backButton")}
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>
        </View>

        {resolvedTitle ? (
          <Text style={styles.title}>{resolvedTitle}</Text>
        ) : null}

        <View style={styles.sections}>
          {sections.map((section) => (
            <View key={section.titleKey} style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: section.titleColor ?? DEFAULT_TITLE_COLOR },
                ]}
              >
                {t(`${translationNamespace}.${section.titleKey}`)}
              </Text>
              <FaqSectionBody
                section={section}
                translationNamespace={translationNamespace}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FaqView;
