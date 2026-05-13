import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { NAV_LINKS, BRAND } from '../lib/constants';
import { useLang } from '../lib/LangContext';
import LangToggle from './LangToggle';

export const Navbar = ({ onInquireClick }) => {
    const { t } = useLang();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 24);
            const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
            for (const sec of sections) {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= 120 && rect.bottom >= 120) {
                    setActiveSection(sec.id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLinkClick = (id) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <header
            data-testid="site-navbar"
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pt-3 md:pt-4">
                <nav
                    className={`relative rounded-full px-5 md:px-7 py-3 transition-all duration-500 ${
                        scrolled
                            ? 'bg-black/60 backdrop-blur-2xl border border-[rgba(212,175,55,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.55)]'
                            : 'bg-white/[0.03] backdrop-blur-xl border border-white/10'
                    }`}
                >
                    <div className="flex items-center justify-between gap-4">
                        {/* Brand */}
                        <a
                            href="#home"
                            onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}
                            className="flex items-center gap-2 group"
                            data-testid="navbar-brand"
                        >
                            <Sparkles className="w-5 h-5 text-[var(--hg-gold)] group-hover:rotate-12 transition-transform" />
                            <span className="font-display text-base md:text-lg tracking-[0.22em] hg-gold-text font-semibold">
                                {BRAND.name}
                            </span>
                        </a>

                        {/* Desktop nav */}
                        <ul className="hidden lg:flex items-center gap-7">
                            {NAV_LINKS.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
                                        data-testid={`navbar-link-${link.id}`}
                                        className="relative text-[12px] tracking-[0.16em] uppercase font-medium text-white/75 hover:text-[var(--hg-gold)] transition-colors"
                                    >
                                        {t(`nav.${link.id}`, link.label)}
                                        <span
                                            className={`absolute left-0 -bottom-1.5 h-[1.5px] bg-[var(--hg-gold)] transition-all duration-500 ${
                                                activeSection === link.id ? 'w-full' : 'w-0'
                                            }`}
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* CTA + Lang toggle */}
                        <div className="hidden md:flex items-center gap-3">
                            <LangToggle testid="navbar-lang-toggle" />
                            <button
                                onClick={onInquireClick}
                                data-testid="navbar-inquiry-button"
                                className="hg-shine relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-[12px] tracking-[0.18em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] transition-colors duration-300 shadow-[0_8px_30px_rgba(212,175,55,0.25)]"
                            >
                                {t('nav.cta', 'Private Viewing')}
                            </button>
                        </div>

                        {/* Mobile actions */}
                        <div className="lg:hidden flex items-center gap-2">
                            <LangToggle testid="navbar-lang-toggle-mobile" />
                            <button
                                className="text-white/85 hover:text-[var(--hg-gold)] transition-colors p-1"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                data-testid="navbar-mobile-menu-button"
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="lg:hidden mx-4 md:mx-6 mt-3 rounded-3xl bg-black/85 backdrop-blur-2xl border border-[rgba(212,175,55,0.22)] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
                        data-testid="navbar-mobile-drawer"
                    >
                        <ul className="py-4 px-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
                                        data-testid={`navbar-mobile-link-${link.id}`}
                                        className="block px-5 py-3 text-sm tracking-[0.18em] uppercase font-medium text-white/85 hover:text-[var(--hg-gold)] hover:bg-white/[0.04] rounded-2xl transition-colors"
                                    >
                                        {t(`nav.${link.id}`, link.label)}
                                    </a>
                                </li>
                            ))}
                            <li className="px-3 pt-3">
                                <button
                                    onClick={() => { setMobileOpen(false); onInquireClick(); }}
                                    data-testid="navbar-mobile-inquiry-button"
                                    className="w-full inline-flex justify-center items-center rounded-full px-5 py-3 text-sm tracking-[0.18em] uppercase font-semibold bg-[var(--hg-gold)] text-black"
                                >
                                    {t('nav.cta', 'Private Viewing')}
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
