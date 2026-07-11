import React from "react";
import { Platform, View } from "react-native";
import { WebView } from "react-native-webview";

import { getYoutubeEmbedUrl } from "../../utils/contentVideo";
import { styles } from "../../styles/components/ContentYoutubeEmbed.styles";

const appendEmbedParams = (embedUrl) => {
  if (!embedUrl) {
    return "";
  }

  const separator = embedUrl.includes("?") ? "&" : "?";
  return `${embedUrl}${separator}playsinline=1&rel=0&modestbranding=1`;
};

const ContentYoutubeEmbed = ({ url, title = "video" }) => {
  const embedUrl = appendEmbedParams(getYoutubeEmbedUrl(url));

  if (!embedUrl) {
    return null;
  }

  if (Platform.OS === "web") {
    return (
      <View style={styles.wrapper}>
        <iframe
          src={embedUrl}
          title={title}
          style={styles.webFrame}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <WebView
        source={{ uri: embedUrl }}
        style={styles.webview}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
      />
    </View>
  );
};

export default ContentYoutubeEmbed;
