import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import ConnectionErrorCard from "../components/ConnectionErrorCard";
import ContentBlockRenderer from "../components/content/ContentBlockRenderer";
import { api, CONTENT_ROUTES, isApiConnectionError } from "../config/api";
import { useContentEditorAccess } from "../hooks/useContentEditorAccess";
import { styles } from "../styles/screens/ContentDetailScreen.styles";

const ContentDetailScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "pt";
  const slug = route?.params?.slug;
  const { isEditor, loadingRole } = useContentEditorAccess();
  const canShowEditorTools = isEditor && !loadingRole;

  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const categoryLabel = useMemo(() => {
    const match = categories.find((item) => item.slug === article?.category);
    return match?.label || article?.category || "";
  }, [article?.category, categories]);

  const fetchArticle = useCallback(async () => {
    if (!slug) {
      return;
    }

    setLoading(true);
    setConnectionError(false);

    try {
      const [categoriesResponse, articleResponse] = await Promise.all([
        api.get(CONTENT_ROUTES.CATEGORIES, { params: { lang } }),
        api.get(CONTENT_ROUTES.BY_SLUG(slug), { params: { lang } }),
      ]);

      setCategories(categoriesResponse.data?.data ?? []);
      setArticle(articleResponse.data?.data ?? null);
    } catch (error) {
      console.error("[ContentDetailScreen] Error loading article:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setArticle(null);
      }
    } finally {
      setLoading(false);
    }
  }, [lang, slug]);

  useFocusEffect(
    useCallback(() => {
      fetchArticle();
    }, [fetchArticle]),
  );

  const handleBack = () => navigation.goBack();

  const handleEdit = () => {
    if (!article?.id) {
      return;
    }

    navigation.navigate("ContentEditor", {
      contentId: article.id,
      slug: article.slug,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
            accessibilityLabel={t("QRScanner.backButton")}
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>

          {canShowEditorTools ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
              activeOpacity={0.8}
              accessibilityLabel={t("Content.editArticle")}
            >
              <Ionicons name="create-outline" size={18} color="#1A7048" />
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#29A66C" />
          </View>
        ) : null}

        {connectionError ? <ConnectionErrorCard onRetry={fetchArticle} /> : null}

        {!loading && !connectionError && article ? (
          <>
            {categoryLabel ? (
              <Text style={styles.category}>{categoryLabel}</Text>
            ) : null}
            <Text style={styles.title}>{article.title}</Text>
            {article.excerpt ? (
              <Text style={styles.excerpt}>{article.excerpt}</Text>
            ) : null}
            {article.coverUrl ? (
              <Image source={{ uri: article.coverUrl }} style={styles.cover} />
            ) : null}
            <ContentBlockRenderer blocks={article.blocks} />
          </>
        ) : null}

        {!loading && !connectionError && !article ? (
          <Text style={styles.excerpt}>{t("Content.notFound")}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContentDetailScreen;
