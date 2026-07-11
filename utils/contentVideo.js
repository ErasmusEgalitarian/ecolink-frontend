export const getYoutubeEmbedUrl = (url = "") => {
  if (!url) {
    return "";
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  return "";
};

export const getVideoSourceUrl = (videoBlock) => {
  if (!videoBlock) {
    return "";
  }

  if (videoBlock.media?.url) {
    return videoBlock.media.url;
  }

  if (videoBlock.provider === "youtube") {
    return getYoutubeEmbedUrl(videoBlock.url);
  }

  return videoBlock.url || "";
};

export const isDraftStatus = (status) =>
  status === "draft" || status === "review";
