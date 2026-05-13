import { motion } from 'framer-motion';
import { Pickaxe, Eye, Scissors, Sparkle, Gem, Crown } from 'lucide-react';
import { CRAFT_STEPS } from '../lib/constants';
import { useLang } from '../lib/LangContext';

const icons = [Pickaxe, Eye, Scissors, Sparkle, Gem, Crown];

export const CraftsmanshipTimeline = () => {
    const { t } = useLang();
    const steps = t('craft.steps') || CRAFT_STEPS;
    const stepData = Array.isArray(steps)
        ? steps.map((s, i) => ({ step: i + 1, ...s }))
        : CRAFT_STEPS;
    return (
        <section
            id="craftsmanship"
            data-testid="craftsmanship-timeline-section"
            className="relative py-20 md:py-28 lg:py-32"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-14 md:mb-20"
                >
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('craft.eyebrow', 'The Process')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('craft.title1', 'From Mine ')}</span>
                        <span className="hg-gold-text">{t('craft.title2', 'to Masterpiece')}</span>
                    </h2>
                    <p className="mt-4 md:mt-6 font-editorial text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        {t('craft.intro')}
                    </p>
                </motion.div>

                {/* Desktop horizontal timeline */}
                <div className="hidden lg:block">
                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute left-0 right-0 top-[40px] h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.4)] to-transparent" />
                        <div className="grid grid-cols-6 gap-4">
                            {stepData.map((step, idx) => {
                                const Icon = icons[idx];
                                return (
                                    <motion.div
                                        key={step.step}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative flex flex-col items-center text-center"
                                    >
                                        <div className="relative w-20 h-20 rounded-full hg-bg-glass-strong flex items-center justify-center mb-6 hg-gold-glow">
                                            <Icon className="w-8 h-8 text-[var(--hg-gold)]" />
                                            <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--hg-gold)] text-black text-xs font-bold flex items-center justify-center">{step.step}</span>
                                        </div>
                                        <h3 className="font-display text-lg text-white tracking-wider">{step.title}</h3>
                                        <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--hg-gold)] mt-1">{step.subtitle}</p>
                                        <p className="text-xs text-white/60 mt-3 leading-relaxed font-editorial">{step.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile/tablet vertical timeline */}
                <div className="lg:hidden space-y-8">
                    {stepData.map((step, idx) => {
                        const Icon = icons[idx];
                        return (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-30px' }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="flex gap-5"
                            >
                                <div className="flex-shrink-0 relative">
                                    <div className="w-14 h-14 rounded-full hg-bg-glass-strong flex items-center justify-center hg-gold-glow">
                                        <Icon className="w-6 h-6 text-[var(--hg-gold)]" />
                                    </div>
                                    {idx < stepData.length - 1 && (
                                        <div className="absolute top-14 left-1/2 w-px h-12 bg-[rgba(212,175,55,0.3)] -translate-x-1/2" />
                                    )}
                                </div>
                                <div className="pb-2">
                                    <h3 className="font-display text-lg text-white tracking-wider">{step.title}</h3>
                                    <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--hg-gold)] mt-1">{step.subtitle}</p>
                                    <p className="text-sm text-white/65 mt-2 leading-relaxed font-editorial">{step.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CraftsmanshipTimeline;
