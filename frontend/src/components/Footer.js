import { Sparkles, Instagram, Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import { BRAND, CONTACT, NAV_LINKS } from '../lib/constants';
import { useLang } from '../lib/LangContext';

export const Footer = () => {
    const { t } = useLang();
    const handleLink = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <footer data-testid="site-footer" className="relative pt-20 pb-10 border-t border-white/10 bg-[#040407]">
            <div className="absolute top-0 left-0 right-0 hg-divider-gold" />
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-[var(--hg-gold)]" />
                            <span className="font-display text-lg tracking-[0.22em] hg-gold-text font-semibold">{BRAND.name}</span>
                        </div>
                        <p className="font-editorial text-white/70 leading-relaxed">
                            {BRAND.tagline}.
                        </p>
                        <p className="font-editorial text-white/45 mt-2 text-sm">{BRAND.taglineCN}</p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-xs tracking-[0.32em] uppercase text-[var(--hg-gold)] mb-5">{t('footer.navigate')}</h4>
                        <ul className="space-y-2">
                            {NAV_LINKS.slice(0, 6).map((l) => (
                                <li key={l.id}>
                                    <button
                                        onClick={() => handleLink(l.id)}
                                        className="text-sm text-white/65 hover:text-[var(--hg-gold)] transition-colors"
                                    >
                                        {t(`nav.${l.id}`, l.label)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs tracking-[0.32em] uppercase text-[var(--hg-gold)] mb-5">{t('footer.contact')}</h4>
                        <ul className="space-y-3 text-sm text-white/65">
                            <li className="flex items-center gap-3"><Phone className="w-3.5 h-3.5 text-[var(--hg-gold)]" /> {CONTACT.whatsappDisplay}</li>
                            <li className="flex items-center gap-3"><MessageCircle className="w-3.5 h-3.5 text-[var(--hg-gold)]" /> {CONTACT.wechatId}</li>
                            <li className="flex items-center gap-3"><Instagram className="w-3.5 h-3.5 text-[var(--hg-gold)]" /> @{CONTACT.instagram}</li>
                            <li className="flex items-center gap-3"><Mail className="w-3.5 h-3.5 text-[var(--hg-gold)]" /> {CONTACT.email}</li>
                            <li className="flex items-start gap-3"><MapPin className="w-3.5 h-3.5 text-[var(--hg-gold)] mt-0.5" /> {CONTACT.address}</li>
                        </ul>
                    </div>

                    {/* Trust */}
                    <div>
                        <h4 className="text-xs tracking-[0.32em] uppercase text-[var(--hg-gold)] mb-5">{t('footer.certifiedBy')}</h4>
                        <div className="flex flex-wrap gap-2">
                            {['GIA', 'IGI', 'HRD', 'SSEF', 'Gübelin'].map((c) => (
                                <span key={c} className="px-3 py-1.5 rounded-full hg-bg-glass text-xs font-display tracking-wider text-white/75">
                                    {c}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-white/50 mt-5 leading-relaxed">{t('footer.certText')}</p>
                    </div>
                </div>

                <div className="mt-12 pt-7 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs tracking-[0.18em] uppercase text-white/40">
                    <span>© {new Date().getFullYear()} {BRAND.name}. {t('footer.rights')}</span>
                    <span>{t('footer.tagline2')}</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
