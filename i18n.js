import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getSystemLanguage, DEFAULT_LANGUAGE } from './utils/language';

// load the Language .json files
import en from './locales/en.json'
import pt from './locales/pt.json'

// I18N Set up
i18n.use(initReactI18next)
    .init({
        lng: getSystemLanguage(),
        fallbackLng: DEFAULT_LANGUAGE,
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: { translation: en },
            pt: { translation: pt }
        },
    });

export default i18n;
