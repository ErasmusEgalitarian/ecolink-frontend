import React from "react";
import { Image, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import ForwardedVideo from "../ForwardedVideo";
import ContentYoutubeEmbed from "./ContentYoutubeEmbed";
import { getVideoSourceUrl } from "../../utils/contentVideo";
import { styles } from "../../styles/components/ContentBlockRenderer.styles";

const ContentVideoBlock = ({ block }) => {
  const { t } = useTranslation();
  const sourceUrl = getVideoSourceUrl(block.video);
  const youtubeUrl = block.video?.url || "";

  if (
    block.video?.provider === "youtube" ||
    youtubeUrl.includes("youtube.com") ||
    youtubeUrl.includes("youtu.be")
  ) {
    return (
      <View>
        <ContentYoutubeEmbed url={youtubeUrl} title={block.content || "video"} />
        {block.content ? <Text style={styles.caption}>{block.content}</Text> : null}
      </View>
    );
  }

  if (block.video?.provider === "upload" && sourceUrl) {
    return (
      <View>
        <ForwardedVideo
          source={{ uri: sourceUrl }}
          style={styles.image}
          controls
          resizeMode="contain"
        />
        {block.content ? <Text style={styles.caption}>{block.content}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.videoFallback}>
      <Text style={styles.videoFallbackText}>{t("Content.videoUnavailable")}</Text>
    </View>
  );
};

const ContentBlockRenderer = ({ blocks = [] }) => {
  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <Text key={`${block.type}-${index}`} style={styles.heading}>
                {block.content}
              </Text>
            );
          case "paragraph":
            return (
              <Text key={`${block.type}-${index}`} style={styles.paragraph}>
                {block.content}
              </Text>
            );
          case "quote":
            return (
              <Text key={`${block.type}-${index}`} style={styles.quote}>
                {block.content}
              </Text>
            );
          case "list":
            return (
              <View key={`${block.type}-${index}`} style={styles.list}>
                {(block.items || []).map((item, itemIndex) => (
                  <View key={`item-${itemIndex}`} style={styles.listItemRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.listItem}>{item}</Text>
                  </View>
                ))}
              </View>
            );
          case "image":
            return (
              <View key={`${block.type}-${index}`}>
                {block.media?.url ? (
                  <Image source={{ uri: block.media.url }} style={styles.image} />
                ) : null}
                {block.content ? (
                  <Text style={styles.caption}>{block.content}</Text>
                ) : null}
              </View>
            );
          case "video":
            return (
              <ContentVideoBlock key={`${block.type}-${index}`} block={block} />
            );
          default:
            return null;
        }
      })}
    </View>
  );
};

export default ContentBlockRenderer;
