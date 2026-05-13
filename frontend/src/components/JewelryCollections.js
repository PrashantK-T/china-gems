import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { fetchJewelry } from '../lib/api';
import { JEWELRY_CATEGORIES } from '../lib/constants';
import { useLang } from '../lib/LangContext';

export const JewelryCollections = ({ onView }) => {
    const { t } = useLang();
    const [active, setActive] = useState('all');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchJewelry()
            .then((data) => { if (!cancelled) setItems(data || []); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const filtered = useMemo(() => {
        if (active === 'all') return items;
        return items.filter((it) => it.category === active);
    }, [items, active]);

    return (
        <section
            id="jewelry"
            data-testid="jewelry-section"
            className="relative py-20 md:py-28 lg:py-32 hg-spotlight"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10 md:mb-14"
                >
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('collections.eyebrow', 'Ornamental Jewelry')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('collections.title1', 'Atelier ')}</span>
                        <span className="hg-gold-text">{t('collections.title2', 'Collections')}</span>
                    </h2>
                    <p className="mt-4 md:mt-6 font-editorial text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        {t('collections.intro')}
                    </p>
                </motion.div>

                {/* Tabs */}
                <div
                    className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14"
                    data-testid="collections-tabs"
                >
                    {JEWELRY_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActive(cat.id)}
                            data-testid={`collections-tab-${cat.id}`}
                            className={`relative rounded-full px-4 md:px-5 py-2 text-[11px] tracking-[0.22em] uppercase font-medium transition-all ${
                                active === cat.id
                                    ? 'bg-[var(--hg-gold)] text-black shadow-[0_8px_24px_rgba(212,175,55,0.32)]'
                                    : 'hg-bg-glass text-white/70 hover:text-white hover:border-[rgba(212,175,55,0.32)]'
                            }`}
                        >
                            {t(`collections.categories.${cat.id}`, cat.label)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] rounded-[22px] hg-bg-glass animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-white/55">No items in this collection yet — contact us for bespoke commissions.</div>
                ) : (
                    <div data-testid="collections-carousel">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                            spaceBetween={24}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            navigation
                            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 24 },
                                1024: { slidesPerView: 3, spaceBetween: 28 },
                                1280: { slidesPerView: 3, spaceBetween: 32 },
                            }}
                            className="!pb-12"
                        >
                            {filtered.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <JewelryCard item={item} onView={() => onView(item, 'jewelry')} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
};

function JewelryCard({ item, onView }) {
    return (
        <article
            className="group relative overflow-hidden rounded-[22px] hg-bg-glass cursor-pointer hover:border-[rgba(212,175,55,0.32)] transition-colors duration-500"
            data-testid="jewelry-card"
            onClick={onView}
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={item.images?.[0] || ''}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="hg-shine absolute inset-0 pointer-events-none" />
            </div>
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-[rgba(212,175,55,0.28)]">
                <span className="text-[9px] tracking-[0.22em] uppercase hg-gold-text font-medium">{item.category.replace('_', ' ')}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-base md:text-lg text-white leading-tight tracking-wide">{item.name}</h3>
                <div className="mt-2 flex items-center gap-3 text-[10px] tracking-[0.18em] uppercase text-white/60">
                    <span>{item.metal_type}</span>
                    {item.total_carat ? <><span className="w-px h-3 bg-white/15" /><span>{item.total_carat}ct</span></> : null}
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase text-[var(--hg-gold)] group-hover:gap-2.5 transition-all">
                    Discover <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </article>
    );
}

export default JewelryCollections;
