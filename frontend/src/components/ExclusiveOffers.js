import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fetchOffers } from '../lib/api';
import { useLang } from '../lib/LangContext';

export const ExclusiveOffers = ({ onInquireClick }) => {
    const { t } = useLang();
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        fetchOffers().then(setOffers).catch(() => setOffers([]));
    }, []);

    return (
        <section
            id="offers"
            data-testid="exclusive-offers-section"
            className="relative py-20 md:py-28 lg:py-32 hg-spotlight"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('offers.eyebrow', 'Curated Selections')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('offers.title1', 'Exclusive ')}</span>
                        <span className="hg-gold-text">{t('offers.title2', 'Collections')}</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {offers.map((offer, idx) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative overflow-hidden rounded-[24px] aspect-[16/10] cursor-pointer"
                            data-testid="offer-card"
                            onClick={onInquireClick}
                        >
                            <img
                                src={offer.banner_image}
                                alt={offer.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                loading="lazy"
                            />
                            <div
                                className="absolute inset-0"
                                style={{ background: `linear-gradient(110deg, ${offer.accent_color}30 0%, rgba(0,0,0,0.85) 70%)` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/40 to-transparent" />
                            <span className="hg-shine absolute inset-0 pointer-events-none" />

                            <div className="relative h-full flex flex-col justify-end p-7 md:p-10">
                                <div className="text-[10px] tracking-[0.32em] uppercase mb-3" style={{ color: offer.accent_color }}>
                                    {offer.subtitle}
                                </div>
                                <h3 className="font-display text-2xl md:text-4xl text-white tracking-wide font-semibold leading-tight">
                                    {offer.title}
                                </h3>
                                {offer.description && (
                                    <p className="mt-3 font-editorial text-base md:text-lg text-white/75 leading-relaxed max-w-md">
                                        {offer.description}
                                    </p>
                                )}
                                <button
                                    data-testid="exclusive-offers-inquiry-button"
                                    onClick={(e) => { e.stopPropagation(); onInquireClick(); }}
                                    className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] transition-colors w-fit"
                                >
                                    {t('offers.cta', 'Request Viewing')} <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExclusiveOffers;
