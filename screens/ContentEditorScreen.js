import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import ConnectionErrorCard from "../components/ConnectionErrorCard";
import ContentImageUploader from "../components/content/ContentImageUploader";
import { api, CONTENT_ROUTES, isApiConnectionError } from "../config/api";
import { styles } from "../styles/screens/ContentEditorScreen.styles";

const STATUS_OPTIONS = ["draft", "review", "published"];
const CATEGORY_FALLBACK = [
  "getting_started",
  "material_types",
  "preparation_tips",
  "impact_stories",
  "cooperative_insights",
];

const createEmptyBlock = (type) => {
  if (type === "list") {
    return { type, order: 0, items: [{ pt: "", en: "" }] };
  }

  if (type === "video") {
    return {
      type,
      order: 0,
      content: { pt: "", en: "" },
      video: { provider: "youtube", url: "" },
    };
  }

  if (type === "image") {
    return {
      type,
      order: 0,
      content: { pt: "", en: "" },
      mediaId: "",
    };
  }

  return {
    type,
    order: 0,
    content: { pt: "", en: "" },
  };
};

const ContentEditorScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "pt";
  const contentId = route?.params?.contentId;

  const [loading, setLoading] = useState(Boolean(contentId));
  const [saving, setSaving] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("getting_started");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [titlePt, setTitlePt] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [excerptPt, setExcerptPt] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [coverMediaId, setCoverMediaId] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [blocks, setBlocks] = useState([createEmptyBlock("paragraph")]);

  const loadCategories = useCallback(async () => {
    const response = await api.get(CONTENT_ROUTES.CATEGORIES, { params: { lang } });
    setCategories(response.data?.data ?? []);
  }, [lang]);

  const loadArticle = useCallback(async () => {
    if (!contentId) {
      return;
    }

    setLoading(true);
    setConnectionError(false);

    try {
      await loadCategories();
      const response = await api.get(CONTENT_ROUTES.MANAGE_BY_ID(contentId));
      const article = response.data?.data;

      if (!article) {
        setErrorMessage(t("Content.notFound"));
        return;
      }

      setSlug(article.slug || "");
      setCategory(article.category || "getting_started");
      setStatus(article.status || "draft");
      setFeatured(Boolean(article.featured));
      setTitlePt(article.translations?.pt?.title || "");
      setTitleEn(article.translations?.en?.title || "");
      setExcerptPt(article.translations?.pt?.excerpt || "");
      setExcerptEn(article.translations?.en?.excerpt || "");
      setCoverMediaId(article.coverMediaId ? String(article.coverMediaId) : "");
      setCoverPreviewUrl(article.coverUrl || "");
      setBlocks(
        (article.blocks || []).length > 0
          ? article.blocks.map((block, index) => ({
              ...block,
              order: block.order ?? index,
              content: block.content || { pt: "", en: "" },
              items: block.items || [],
              mediaId: block.mediaId ? String(block.mediaId) : "",
              previewUrl: block.previewUrl || "",
              video: block.video || undefined,
            }))
          : [createEmptyBlock("paragraph")],
      );
    } catch (error) {
      console.error("[ContentEditorScreen] Error loading article:", error);
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        setErrorMessage(t("Content.saveError"));
      }
    } finally {
      setLoading(false);
    }
  }, [contentId, loadCategories, t]);

  useEffect(() => {
    if (contentId) {
      loadArticle();
      return;
    }

    loadCategories().catch((error) => {
      console.error("[ContentEditorScreen] Error loading categories:", error);
    });
  }, [contentId, loadArticle, loadCategories]);

  const handleBack = () => navigation.goBack();

  const updateBlock = (index, patch) => {
    setBlocks((current) =>
      current.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block,
      ),
    );
  };

  const updateBlockContent = (index, locale, value) => {
    setBlocks((current) =>
      current.map((block, blockIndex) => {
        if (blockIndex !== index) {
          return block;
        }

        return {
          ...block,
          content: {
            ...(block.content || {}),
            [locale]: value,
          },
        };
      }),
    );
  };

  const addBlock = (type) => {
    setBlocks((current) => [
      ...current,
      { ...createEmptyBlock(type), order: current.length },
    ]);
  };

  const removeBlock = (index) => {
    setBlocks((current) => current.filter((_, blockIndex) => blockIndex !== index));
  };

  const moveBlock = (index, direction) => {
    setBlocks((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

      return next.map((block, blockIndex) => ({
        ...block,
        order: blockIndex,
      }));
    });
  };

  const buildPayload = (nextStatus = status) => {
    const normalizedBlocks = blocks
      .map((block, index) => {
        const payload = {
          type: block.type,
          order: index,
        };

        if (block.content?.pt || block.content?.en) {
          payload.content = {
            pt: block.content.pt?.trim() || "",
            ...(block.content.en?.trim()
              ? { en: block.content.en.trim() }
              : {}),
          };
        }

        if (block.type === "list") {
          payload.items = (block.items || [])
            .filter((item) => item.pt?.trim())
            .map((item) => ({
              pt: item.pt.trim(),
              ...(item.en?.trim() ? { en: item.en.trim() } : {}),
            }));
        }

        if (block.type === "image" && block.mediaId?.trim()) {
          payload.mediaId = block.mediaId.trim();
        }

        if (block.type === "video" && block.video?.url?.trim()) {
          payload.video = {
            provider: block.video.provider || "youtube",
            url: block.video.url.trim(),
          };
        }

        return payload;
      })
      .filter((block) => {
        if (block.type === "list") {
          return block.items?.length > 0;
        }
        if (block.type === "image") {
          return Boolean(block.mediaId);
        }
        if (block.type === "video") {
          return Boolean(block.video?.url);
        }
        return Boolean(block.content?.pt);
      });

    return {
      slug: slug.trim().toLowerCase(),
      category,
      format: "mixed",
      status: nextStatus,
      featured,
      coverMediaId: coverMediaId.trim() || undefined,
      translations: {
        pt: {
          title: titlePt.trim(),
          excerpt: excerptPt.trim() || undefined,
        },
        en: {
          title: titleEn.trim() || undefined,
          excerpt: excerptEn.trim() || undefined,
        },
      },
      blocks: normalizedBlocks,
    };
  };

  const handleSave = async (nextStatus = status) => {
    setErrorMessage("");

    if (!slug.trim() || !titlePt.trim()) {
      setErrorMessage(t("Content.validationRequired"));
      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload(nextStatus);

      if (contentId) {
        await api.put(CONTENT_ROUTES.UPDATE(contentId), payload);
        if (nextStatus === "published") {
          await api.patch(CONTENT_ROUTES.PUBLISH(contentId), {
            status: "published",
          });
        }
      } else {
        const response = await api.post(CONTENT_ROUTES.CREATE, payload);
        const createdId = response.data?.data?._id;

        if (nextStatus === "published" && createdId) {
          await api.patch(CONTENT_ROUTES.PUBLISH(createdId), {
            status: "published",
          });
        }
      }

      Alert.alert(t("Content.saveSuccessTitle"), t("Content.saveSuccessMessage"));
      navigation.goBack();
    } catch (error) {
      console.error("[ContentEditorScreen] Error saving article:", error);
      setErrorMessage(error?.message || t("Content.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const renderBlockEditor = (block, index) => (
    <View key={`block-${index}`} style={styles.blockCard}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockType}>{t(`Content.blockTypes.${block.type}`)}</Text>
        <View style={styles.blockActions}>
          <TouchableOpacity
            style={[styles.moveButton, index === 0 && styles.moveButtonDisabled]}
            onPress={() => moveBlock(index, -1)}
            disabled={index === 0}
            accessibilityLabel={t("Content.moveBlockUp")}
          >
            <Ionicons
              name="chevron-up"
              size={16}
              color={index === 0 ? "#9FB4C1" : "#1A7048"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.moveButton,
              index === blocks.length - 1 && styles.moveButtonDisabled,
            ]}
            onPress={() => moveBlock(index, 1)}
            disabled={index === blocks.length - 1}
            accessibilityLabel={t("Content.moveBlockDown")}
          >
            <Ionicons
              name="chevron-down"
              size={16}
              color={index === blocks.length - 1 ? "#9FB4C1" : "#1A7048"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeBlock(index)}>
            <Text style={styles.removeBlock}>{t("Content.removeBlock")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {(block.type === "heading" ||
        block.type === "paragraph" ||
        block.type === "quote" ||
        block.type === "image" ||
        block.type === "video") && (
        <>
          <Text style={styles.sectionLabel}>{t("Content.fieldPt")}</Text>
          <TextInput
            style={[styles.input, block.type !== "heading" && styles.textArea]}
            value={block.content?.pt || ""}
            onChangeText={(value) => updateBlockContent(index, "pt", value)}
            multiline={block.type !== "heading"}
          />
          <Text style={styles.sectionLabel}>{t("Content.fieldEn")}</Text>
          <TextInput
            style={[styles.input, block.type !== "heading" && styles.textArea]}
            value={block.content?.en || ""}
            onChangeText={(value) => updateBlockContent(index, "en", value)}
            multiline={block.type !== "heading"}
          />
        </>
      )}

      {block.type === "image" ? (
        <>
          <Text style={styles.sectionLabel}>{t("Content.imageBlock")}</Text>
          <ContentImageUploader
            slug={slug}
            purpose="inline"
            previewUrl={block.previewUrl}
            onUploaded={({ mediaId, previewUrl }) =>
              updateBlock(index, {
                mediaId: String(mediaId),
                previewUrl,
              })
            }
          />
        </>
      ) : null}

      {block.type === "video" ? (
        <>
          <Text style={styles.sectionLabel}>{t("Content.videoUrl")}</Text>
          <TextInput
            style={styles.input}
            value={block.video?.url || ""}
            onChangeText={(value) =>
              updateBlock(index, {
                video: { provider: "youtube", url: value },
              })
            }
            autoCapitalize="none"
          />
        </>
      ) : null}

      {block.type === "list" ? (
        <>
          {(block.items || []).map((item, itemIndex) => (
            <View key={`list-item-${itemIndex}`} style={{ gap: 8 }}>
              <Text style={styles.sectionLabel}>
                {t("Content.listItem", { index: itemIndex + 1 })}
              </Text>
              <TextInput
                style={styles.input}
                value={item.pt || ""}
                onChangeText={(value) => {
                  const nextItems = [...(block.items || [])];
                  nextItems[itemIndex] = { ...nextItems[itemIndex], pt: value };
                  updateBlock(index, { items: nextItems });
                }}
                placeholder={t("Content.fieldPt")}
              />
              <TextInput
                style={styles.input}
                value={item.en || ""}
                onChangeText={(value) => {
                  const nextItems = [...(block.items || [])];
                  nextItems[itemIndex] = { ...nextItems[itemIndex], en: value };
                  updateBlock(index, { items: nextItems });
                }}
                placeholder={t("Content.fieldEn")}
              />
            </View>
          ))}
          <TouchableOpacity
            style={styles.addBlockButton}
            onPress={() =>
              updateBlock(index, {
                items: [...(block.items || []), { pt: "", en: "" }],
              })
            }
          >
            <Text style={styles.addBlockText}>{t("Content.addListItem")}</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29A66C" />
        </View>
      </SafeAreaView>
    );
  }

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
          >
            <Ionicons name="arrow-back" size={16} color="#FDFEFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          {contentId ? t("Content.editArticle") : t("Content.createArticle")}
        </Text>

        {connectionError ? (
          <ConnectionErrorCard onRetry={loadArticle} />
        ) : null}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Text style={styles.sectionLabel}>{t("Content.slug")}</Text>
        <TextInput
          style={styles.input}
          value={slug}
          onChangeText={setSlug}
          autoCapitalize="none"
        />

        <Text style={styles.sectionLabel}>{t("Content.category")}</Text>
        <View style={styles.chipRow}>
          {(categories.length > 0
            ? categories.map((item) => item.slug)
            : CATEGORY_FALLBACK
          ).map((slugOption) => {
            const label =
              categories.find((item) => item.slug === slugOption)?.label ||
              slugOption;
            const isActive = category === slugOption;
            return (
              <TouchableOpacity
                key={slugOption}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setCategory(slugOption)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>{t("Content.status")}</Text>
        <View style={styles.chipRow}>
          {STATUS_OPTIONS.map((statusOption) => {
            const isActive = status === statusOption;
            return (
              <TouchableOpacity
                key={statusOption}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setStatus(statusOption)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {t(`Content.statusOptions.${statusOption}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>{t("Content.titlePt")}</Text>
        <TextInput style={styles.input} value={titlePt} onChangeText={setTitlePt} />

        <Text style={styles.sectionLabel}>{t("Content.titleEn")}</Text>
        <TextInput style={styles.input} value={titleEn} onChangeText={setTitleEn} />

        <Text style={styles.sectionLabel}>{t("Content.excerptPt")}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={excerptPt}
          onChangeText={setExcerptPt}
          multiline
        />

        <Text style={styles.sectionLabel}>{t("Content.excerptEn")}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={excerptEn}
          onChangeText={setExcerptEn}
          multiline
        />

        <Text style={styles.sectionLabel}>{t("Content.coverImage")}</Text>
        <ContentImageUploader
          slug={slug}
          purpose="cover"
          previewUrl={coverPreviewUrl}
          onUploaded={({ mediaId, previewUrl }) => {
            setCoverMediaId(String(mediaId));
            setCoverPreviewUrl(previewUrl);
          }}
        />

        <Text style={styles.sectionLabel}>{t("Content.blocks")}</Text>
        <View style={styles.addBlockRow}>
          {["paragraph", "heading", "quote", "list", "video", "image"].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.addBlockButton}
              onPress={() => addBlock(type)}
            >
              <Text style={styles.addBlockText}>
                {t(`Content.addBlock.${type}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {blocks.map(renderBlockEditor)}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleSave("draft")}
            disabled={saving}
          >
            <Text style={styles.secondaryButtonText}>
              {saving ? t("Content.saving") : t("Content.saveDraft")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleSave("published")}
            disabled={saving}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? t("Content.saving") : t("Content.publish")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContentEditorScreen;
