import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourses from './resourses';

i18n.on('initialized', () => {
    setLanguage(getInitLang());
});
i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: ['en', 'ru'],
    interpolation: {
        escapeValue: false,
    },
    resources: resourses,
    react: {
        bindI18n: 'languageChanged',
        bindI18nStore: '',
        transEmptyNodeValue: '',
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
        useSuspense: true,
    },
});
export default i18n;

function getInitLang() {
    let sCurrLang = navigator.language.toLowerCase();
    if (i18n.languages.includes(sCurrLang)) {
        return sCurrLang;
    }
    // In case of 'ru-Ru' languages
    if (sCurrLang.match('-')) {
        [sCurrLang] = sCurrLang.split('-');
    } else if (sCurrLang.match('_')) {
        [sCurrLang] = sCurrLang.split('-');
    }
    if (i18n.languages.includes(sCurrLang)) {
        return sCurrLang;
    }
    return 'en';
}

export function getLanguage(): string {
    return i18n.language;
}
export function getAllLanguages() {
    return [...i18n.languages].sort();
}
export function setLanguage(sLang: string): void {
    i18n.changeLanguage(sLang).catch((oError) => {
        // eslint-disable-next-line no-console
        console.log(oError.message);
    });
}
