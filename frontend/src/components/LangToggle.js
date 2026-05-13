import { useLang } from '../lib/LangContext';

export default function LangToggle({ size = 'sm', testid = 'lang-toggle' }) {
    const { lang, setLang } = useLang();
    const next = lang === 'en' ? 'zh' : 'en';
    const labels = { en: 'EN', zh: '中' };
    const isLarge = size === 'lg';
    return (
        <button
            onClick={() => setLang(next)}
            data-testid={testid}
            aria-label={lang === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            className={`group relative inline-flex items-center gap-1 rounded-full hg-bg-glass border border-white/10 hover:border-[var(--hg-gold)] transition-colors ${
                isLarge ? 'px-4 py-2 text-xs' : 'px-3 py-1.5 text-[11px]'
            } font-medium tracking-[0.2em] uppercase text-white/75 hover:text-[var(--hg-gold)]`}
        >
            <span className={lang === 'en' ? 'text-[var(--hg-gold)]' : 'text-white/55'}>{labels.en}</span>
            <span className="text-white/30 px-0.5">/</span>
            <span className={lang === 'zh' ? 'text-[var(--hg-gold)]' : 'text-white/55'}>{labels.zh}</span>
        </button>
    );
}
