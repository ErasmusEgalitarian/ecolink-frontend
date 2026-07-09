import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import ContentArticleCard from "../components/content/ContentArticleCard";
import ContentCategoryChips from "../components/content/ContentCategoryChips";
import { api, CONTENT_ROUTES, isApiConnectionError } from "../config/api";
import { useContentEditorAccess } from "../hooks/useContentEditorAccess";
import { isDraftStatus } from "../utils/contentVideo";
import { styles } from "../styles/screens/ContentListScreen.styles";

const EDITOR_FILTERS = ["all", "published", "draft"];

const ContentListScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "pt";
  const { isEditor, loadingRole } = useContentEditorAccess();
  const canShowEditorTools = isEditor && !loadingRole;

  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editorFilter, setEditorFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((item) => [item.slug, item.label])),
    [categories],
  );

  const publishedArticles = useMemo(
    () => articles.filter((article) => article.status === "published"),
    [articles],
  );

  const draftArticles = useMemo(
    () => articles.filter((article) => isDraftStatus(article.status)),
    [articles],
  );

  const featuredArticles = useMemo(
    () => publishedArticles.filter((article) => article.featured),
    [publishedArticles],
  );

  const regularPublishedArticles = useMemo(
    () => publishedArticles.filter((article) => !article.featured),
    [publishedArticles],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);

    try {
      const listParams = {
        lang,
        category: selectedCategory || undefined,
        limit: 50,
      };

      if (canShowEditorTools) {
        if (editorFilter === "draft") {
          listParams.status = "draft";
        } else if (editorFilter === "published") {
          listParams.status = "published";
        } else {
          listParams.includeDrafts = true;
        }
      }

      const [categoriesResponse, articlesResponse] = await Promise.all([
        api.get(CONTENT_ROUTES.CATEGORIES, { params: { lang } }),
        api.get(CONTENT_ROUTES.LIST, { params: listParams }),
      ]);

      setCategories(categoriesResponse.data?.data ?? []);
      setArticles(articlesResponse.data?.data ?? []);
    } catch (error) {
      console.error("[ContentListScreen] Error loading content:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setCategories([]);
        setArticles([]);
      }
    } finally {
      setLoading(false);
    }
  }, [canShowEditorTools, editorFilter, lang, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  useEffect(() => {
    fetchData();
  }, [selectedCategory, editorFilter, fetchData]);

  const getStatusLabel = (status) => {
    if (!status || status === "published") {
      return null;
    }

    return t(`Content.statusOptions.${status}`);
  };

  const handleOpenArticle = (article) => {
    if (canShowEditorTools && isDraftStatus(article.status)) {
      navigation.navigate("ContentEditor", {
        contentId: article.id,
        slug: article.slug,
      });
      return;
    }

    navigation.navigate("ContentDetail", {
      slug: article.slug,
      articleId: article.id,
    });
  };

  const handleCreateContent = () => {
    navigation.navigate("ContentEditor");
  };

  const renderArticleCards = (items, { featured = false, showStatus = false } = {}) =>
    items.map((article) => (
      <ContentArticleCard
        key={article.id}
        article={article}
        categoryLabel={categoryMap[article.category]}
        statusLabel={showStatus ? getStatusLabel(article.status) : null}
        onPress={handleOpenArticle}
        featured={featured}
      />
    ));

  const renderArticles = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29A66C" />
        </View>
      );
    }

    if (connectionError) {
      return <ConnectionErrorCard onRetry={fetchData} />;
    }

    const visiblePublished =
      editorFilter === "draft" ? [] : publishedArticles;
    const visibleDrafts =
      editorFilter === "published" ? [] : draftArticles;

    if (visiblePublished.length === 0 && visibleDrafts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t("Content.emptyTitle")}</Text>
          <Text style={styles.emptyMessage}>{t("Content.emptyMessage")}</Text>
        </View>
      );
    }

    return (
      <>
        {canShowEditorTools && visibleDrafts.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("Content.draftsTitle")}</Text>
            <View style={styles.list}>
              {renderArticleCards(visibleDrafts, { showStatus: true })}
            </View>
          </View>
        ) : null}

        {featuredArticles.length > 0 && editorFilter !== "draft" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("Content.featuredTitle")}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {renderArticleCards(featuredArticles, { featured: true })}
            </ScrollView>
          </View>
        ) : null}

        {visiblePublished.length > 0 ? (
          <View style={styles.section}>
            {canShowEditorTools && editorFilter === "all" ? (
              <Text style={styles.sectionTitle}>{t("Content.publishedTitle")}</Text>
            ) : null}
            <View style={styles.list}>
              {renderArticleCards(
                featuredArticles.length > 0
                  ? regularPublishedArticles
                  : visiblePublished,
              )}
            </View>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("Content.title")}</Text>
          <Text style={styles.subtitle}>{t("Content.subtitle")}</Text>
        </View>

        {canShowEditorTools ? (
          <View style={styles.editorFilterRow}>
            {EDITOR_FILTERS.map((filter) => {
              const isActive = editorFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.editorFilterChip, isActive && styles.editorFilterChipActive]}
                  onPress={() => setEditorFilter(filter)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.editorFilterText,
                      isActive && styles.editorFilterTextActive,
                    ]}
                  >
                    {t(`Content.editorFilters.${filter}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        <ContentCategoryChips
          categories={categories}
          selectedSlug={selectedCategory}
          onSelect={setSelectedCategory}
          allLabel={t("Content.allCategories")}
        />

        {renderArticles()}
      </ScrollView>

      {canShowEditorTools ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateContent}
          activeOpacity={0.85}
          accessibilityLabel={t("Content.createArticle")}
        >
          <Ionicons name="add" size={28} color="#FDFEFF" />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
};

export default ContentListScreen;
