import { motion } from 'framer-motion';
import { Sparkles, Award, Globe, Heart } from 'lucide-react';
import { useLang } from '../lib/LangContext';

const pillarIcons = [Sparkles, Award, Globe, Heart];

export const About = () => {
    const { t } = useLang();
    const pillars = t('about.pillars');
    const pillarList = Array.isArray(pillars) ? pillars : [];

    return (
        <section id="about" data-testid="about-section" className="relative py-20 md:py-28 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9 }}
                >
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('about.eyebrow')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                        <span className="text-white">{t('about.title1')}</span>
                        <span className="hg-gold-text">{t('about.title2')}</span>
                    </h2>
                    <p className="mt-6 md:mt-8 font-editorial text-lg md:text-xl text-white/75 leading-relaxed">
                        {t('about.p1')}
                    </p>
                    <p className="mt-4 md:mt-6 font-editorial text-lg md:text-xl text-white/70 leading-relaxed">
                        {t('about.p2')}
                    </p>

                    <div className="mt-10 grid grid-cols-2 gap-5">
                        {pillarList.map((p, idx) => {
                            const Icon = pillarIcons[idx] || Sparkles;
                            return (
                                <motion.div
                                    key={p.title + idx}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="flex gap-4 rounded-2xl hg-bg-glass p-4 md:p-5"
                                    data-testid="about-pillar"
                                >
                                    <Icon className="w-7 h-7 text-[var(--hg-gold)] flex-shrink-0 mt-1" />
                                    <div>
                                        <div className="font-display text-base md:text-lg text-white tracking-wide">{p.title}</div>
                                        <div className="text-xs text-white/65 mt-1 leading-relaxed">{p.text}</div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, delay: 0.15 }}
                    className="relative"
                >
                    <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden hg-gold-glow">
                        <img
                            src="https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/j1ujg5bv_jwel-1.jpeg"
                            alt="HUANG GEMS Atelier"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute bottom-7 left-7 right-7">
                            <div className="font-display text-xl md:text-2xl text-white tracking-wide">
                                {t('about.badge1')}
                            </div>
                            <div className="text-xs tracking-[0.22em] uppercase text-[var(--hg-gold)] mt-2">
                                {t('about.badge2')}
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[var(--hg-gold)]/10 blur-2xl" />
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[var(--hg-sapphire)]/10 blur-2xl" />
                </motion.div>
            </div>
        </section>
    );
};

export default About;
