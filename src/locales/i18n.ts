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
    let currLang = navigator.language.toLowerCase();
    if (i18n.languages.includes(currLang)) {
        return currLang;
    }
    // In case of 'ru-Ru' languages
    if (currLang.match('-')) {
        [currLang] = currLang.split('-');
    } else if (currLang.match('_')) {
        [currLang] = currLang.split('-');
    }
    if (i18n.languages.includes(currLang)) {
        return currLang;
    }
    return 'en';
}

export function getLanguage(): string {
    return i18n.language;
}
export function getAllLanguages() {
    return [...i18n.languages].sort();
}
export function setLanguage(language: string): void {
    i18n.changeLanguage(language).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error.message);
    });
}
