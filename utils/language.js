import * as Localization from "expo-localization";

export const LANGUAGE_STORAGE_KEY = "preferredLanguage";
export const DEFAULT_LANGUAGE = "pt";
export const SUPPORTED_LANGUAGES = ["en", "pt"];

export const normalizeLanguage = (language) => {
  const languageCode = language?.split("-")[0]?.toLowerCase();

  return SUPPORTED_LANGUAGES.includes(languageCode)
    ? languageCode
    : DEFAULT_LANGUAGE;
};

export const getSystemLanguage = () => {
  const [locale] = Localization.getLocales();

  return normalizeLanguage(locale?.languageTag || locale?.languageCode);
};
