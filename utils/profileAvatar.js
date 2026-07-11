export const withAvatarCacheBuster = (url, version = Date.now()) => {
  if (!url) {
    return null;
  }

  const baseUrl = url.split("?")[0];
  return `${baseUrl}?v=${version}`;
};
