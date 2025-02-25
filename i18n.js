import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// load the Language .json files
import en from './locales/en.json'
import pt from './locales/pt.json'

// I18N Set up
i18n.use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
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
