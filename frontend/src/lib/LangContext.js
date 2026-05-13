import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { TRANSLATIONS, getNested } from './translations';

const LangContext = createContext({
    lang: 'en',
    setLang: () => {},
    t: (k) => k,
});

export function LangProvider({ children }) {
    const [lang, setLangState] = useState(() => {
        if (typeof window === 'undefined') return 'en';
        const stored = localStorage.getItem('hg_lang');
        if (stored === 'en' || stored === 'zh') return stored;
        return (navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
    });

    useEffect(() => {
        try { localStorage.setItem('hg_lang', lang); } catch (_) {}
        try { document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'; } catch (_) {}
    }, [lang]);

    const setLang = useCallback((l) => setLangState(l === 'zh' ? 'zh' : 'en'), []);

    const t = useCallback((path, fallback) => {
        const v = getNested(TRANSLATIONS[lang], path);
        if (v !== undefined && v !== null) return v;
        const en = getNested(TRANSLATIONS.en, path);
        return en !== undefined && en !== null ? en : (fallback !== undefined ? fallback : path);
    }, [lang]);

    const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
    return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
    return useContext(LangContext);
}
