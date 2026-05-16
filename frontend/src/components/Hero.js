import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useLang } from '../lib/LangContext';

// Cinematic gem rotation cycle: ruby → sapphire → emerald → diamond
const GEM_PHASES = [
    { name: 'Ruby', color: '#DC2626', glow: 'rgba(220, 38, 38, 0.55)', accent: '#FF5252', label: 'Pigeon Blood Ruby' },
    { name: 'Sapphire', color: '#2563EB', glow: 'rgba(37, 99, 235, 0.55)', accent: '#4F8BFF', label: 'Royal Blue Sapphire' },
    { name: 'Emerald', color: '#10B981', glow: 'rgba(16, 185, 129, 0.55)', accent: '#34D399', label: 'Muzo Emerald' },
    { name: 'Diamond', color: '#F3F4F6', glow: 'rgba(255, 255, 255, 0.45)', accent: '#FFFFFF', label: 'D-Flawless Diamond' },
];

// SVG gemstone (cushion-cut octahedron, faceted)
function CutGem({ phase, reduced }) {
    return (
        <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0 m-auto w-full h-full"
            style={{ filter: `drop-shadow(0 0 60px ${phase.glow})` }}
            animate={reduced ? undefined : { rotate: 360 }}
            transition={reduced ? undefined : { duration: 18, ease: 'linear', repeat: Infinity }}
        >
            <defs>
                <radialGradient id={`gem-face-${phase.name}`} cx="50%" cy="35%" r="80%">
                    <stop offset="0%" stopColor={phase.accent} stopOpacity="1" />
                    <stop offset="55%" stopColor={phase.color} stopOpacity="1" />
                    <stop offset="100%" stopColor="#000" stopOpacity="1" />
                </radialGradient>
                <linearGradient id={`gem-edge-${phase.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                    <stop offset="50%" stopColor={phase.accent} stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="gem-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Outer crystal octahedron */}
            <polygon
                points="100,18 175,80 165,140 100,182 35,140 25,80"
                fill={`url(#gem-face-${phase.name})`}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
            />
            {/* Top facets */}
            <polygon points="100,18 175,80 130,75 100,55" fill={`url(#gem-edge-${phase.name})`} opacity="0.85" />
            <polygon points="100,18 25,80 70,75 100,55" fill={`url(#gem-edge-${phase.name})`} opacity="0.65" />
            <polygon points="100,55 130,75 100,100 70,75" fill={phase.accent} opacity="0.9" />
            {/* Bottom facets */}
            <polygon points="175,80 165,140 130,75" fill={`url(#gem-edge-${phase.name})`} opacity="0.55" />
            <polygon points="25,80 35,140 70,75" fill={`url(#gem-edge-${phase.name})`} opacity="0.45" />
            <polygon points="130,75 100,100 100,182 165,140" fill={phase.color} opacity="0.75" />
            <polygon points="70,75 100,100 100,182 35,140" fill="#000" opacity="0.35" />
            <polygon points="100,100 165,140 100,182" fill={`url(#gem-edge-${phase.name})`} opacity="0.55" />
            <polygon points="100,100 35,140 100,182" fill="#000" opacity="0.4" />
            {/* Highlight sparkle */}
            <polygon points="100,28 145,72 115,72 100,52" fill="url(#gem-highlight)" opacity="0.55" />
        </motion.svg>
    );
}

function GoldFloatingShard({ x, y, size, delay }) {
    return (
        <motion.div
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                opacity: [0.4, 0.85, 0.4],
            }}
            transition={{ duration: 6 + delay, ease: 'easeInOut', repeat: Infinity, delay }}
        >
            <svg viewBox="0 0 20 20" className="w-full h-full drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]">
                <polygon points="10,1 18,10 10,19 2,10" fill="#D4AF37" stroke="#F3D27A" strokeWidth="0.5" />
                <polygon points="10,1 14,10 10,5" fill="#F3D27A" />
            </svg>
        </motion.div>
    );
}

export const Hero = () => {
    const { t } = useLang();
    const reduced = useReducedMotion();
    const [phaseIdx, setPhaseIdx] = useState(0);
    const phase = GEM_PHASES[phaseIdx];

    useEffect(() => {
        if (reduced) return undefined;
        const id = setInterval(() => setPhaseIdx((p) => (p + 1) % GEM_PHASES.length), 5500);
        return () => clearInterval(id);
    }, [reduced]);

    return (
        <section
            id="home"
            data-testid="hero-section"
            className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden"
        >
            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 hg-hero-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
            {/* Color wash that shifts with phase */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                    background: `radial-gradient(1000px 700px at 75% 50%, ${phase.glow.replace('0.55', '0.18')}, transparent 60%)`,
                }}
                transition={{ duration: 2.6 }}
            />

            {/* Floating dust particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 28 }).map((_, i) => (
                    <span
                        key={i}
                        className="hg-particle"
                        style={{
                            left: `${(i * 7.3) % 100}%`,
                            animationDuration: `${10 + (i % 6) * 2}s`,
                            animationDelay: `${-(i * 0.6) % 10}s`,
                            width: `${2 + (i % 3)}px`,
                            height: `${2 + (i % 3)}px`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10  max-w-7xl px-4 md:px-8 lg:px-12 py-24 md:py-32 ">
                {/* Left: copy */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center lg:text-center"
                >
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full hg-bg-glass">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--hg-gold)] hg-pulse-gold" />
                        <span className="text-[10px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                            {t('hero.badge', 'Est. 1998 · Ultra-Rare Gemstones')}
                        </span>
                    </div>
                    <h1 className="font-display text-center text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[0.95] tracking">
                        <span className=" text-white">{t('hero.title1', 'Where Rarity Meets Eternity')} </span>
                        <span className=" hg-gold-text">{t('hero.title2', 'Meets Eternity')}</span>
                    </h1>
                    <p className="mt-6 md:mt-8 inline font-editorial text-xl md:text-2xl text-white/75 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {t('hero.intro')}
                    </p>
                    <div className="mt-9 md:mt-10 flex flex-wrap items-center justify-center lg:justify-center gap-4">
                        <a
                            href="#gemstones"
                            data-testid="hero-primary-cta-button"
                            className="hg-shine inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[12px] tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] transition-colors shadow-[0_18px_60px_rgba(212,175,55,0.22)]"
                        >
                            {t('hero.ctaPrimary', 'Explore the Vault')}
                        </a>
                        <a
                            href="#contact"
                            data-testid="hero-secondary-cta-button"
                            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[12px] tracking-[0.22em] uppercase font-medium bg-white/[0.04] text-white border border-white/15 hover:border-[var(--hg-gold)] hover:text-[var(--hg-gold)] transition-colors backdrop-blur-md"
                        >
                            {t('hero.ctaSecondary', 'Private Viewing')}
                        </a>
                    </div>
                    {/* Trust strip */}
                    <div className="mt-10 md:mt-14 grid grid-cols-3 gap-4 md:gap-8 max-w-md mx-auto items-center">
                        {[
                            { num: '25+', lbl: t('hero.stats.years', 'Years') },
                            { num: '5K+', lbl: t('hero.stats.stones', 'Stones Curated') },
                            { num: '40+', lbl: t('hero.stats.countries', 'Countries Served') },
                        ].map((stat) => (
                            <div key={stat.lbl} className="text-center lg:text-center">
                                <div className="font-display text-2xl md:text-3xl hg-gold-text font-semibold">{stat.num}</div>
                                <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-white/55 mt-1">{stat.lbl}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-square w-full max-w-[640px] mx-auto"
                    data-testid="hero-gemstone-visual"
                >
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ boxShadow: `0 0 120px 8px ${phase.glow}, inset 0 0 80px ${phase.glow.replace('0.55', '0.12')}` }}
                        transition={{ duration: 2.2 }}
                    />
                    <motion.div
                        className="absolute inset-6 rounded-full border border-[rgba(212,175,55,0.18)]"
                        animate={reduced ? undefined : { rotate: 360 }}
                        transition={reduced ? undefined : { duration: 38, ease: 'linear', repeat: Infinity }}
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[var(--hg-gold)]"
                                style={{
                                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-46%)`,
                                    boxShadow: '0 0 10px rgba(212,175,55,0.85)',
                                }}
                            />
                        ))}
                    </motion.div>
                    <motion.div
                        className="absolute inset-16 rounded-full border border-white/8"
                        animate={reduced ? undefined : { rotate: -360 }}
                        transition={reduced ? undefined : { duration: 52, ease: 'linear', repeat: Infinity }}
                    />
                    <GoldFloatingShard x={12} y={20} size={18} delay={0} />
                    <GoldFloatingShard x={82} y={28} size={14} delay={0.8} />
                    <GoldFloatingShard x={88} y={72} size={20} delay={1.6} />
                    <GoldFloatingShard x={8} y={68} size={16} delay={2.4} />
                    <GoldFloatingShard x={48} y={5} size={12} delay={1.2} />
                    <motion.div
                        className="absolute inset-[18%] hg-float"
                        animate={reduced ? undefined : { y: [0, -10, 0] }}
                        transition={reduced ? undefined : { duration: 5, ease: 'easeInOut', repeat: Infinity }}
                    >
                        <CutGem phase={phase} reduced={reduced} />
                    </motion.div>
                    <motion.div
                        key={phase.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <div className="px-4 py-2 rounded-full hg-bg-glass-strong border border-[rgba(212,175,55,0.32)] inline-flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--hg-gold)]" />
                            <span className="font-display text-sm md:text-base text-white tracking-[0.22em]">{phase.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {GEM_PHASES.map((_, i) => (
                                <span
                                    key={i}
                                    className={`block h-[3px] rounded-full transition-all duration-500 ${
                                        i === phaseIdx ? 'w-7 bg-[var(--hg-gold)]' : 'w-2 bg-white/20'
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div> */}
            </div>

            {/* Scroll cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/55"
            >
                <span className="text-[10px] tracking-[0.32em] uppercase">{t('hero.scroll', 'Scroll')}</span>
                <ChevronDown className="w-4 h-4" />
            </motion.div>
        </section>
    );
};

export default Hero;
