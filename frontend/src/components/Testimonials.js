import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import { fetchTestimonials } from '../lib/api';
import { useLang } from '../lib/LangContext';

export const Testimonials = () => {
    const { t } = useLang();
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchTestimonials().then(setItems).catch(() => setItems([]));
    }, []);

    return (
        <section
            id="testimonials"
            data-testid="testimonials-section"
            className="relative py-20 md:py-28 lg:py-32"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('testi.eyebrow', 'Client Voices')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('testi.title1', 'In the Words of ')}</span>
                        <span className="hg-gold-text">{t('testi.title2', 'Our Patrons')}</span>
                    </h2>
                </motion.div>

                {items.length > 0 ? (
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        slidesPerView={1}
                        spaceBetween={28}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5500, disableOnInteraction: false }}
                        loop
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1280: { slidesPerView: 3 },
                        }}
                        className="!pb-12"
                    >
                        {items.map((t) => (
                            <SwiperSlide key={t.id}>
                                <div className="h-full rounded-[22px] hg-bg-glass-strong p-7 md:p-9 relative overflow-hidden" data-testid="testimonial-card">
                                    <Quote className="absolute top-4 right-5 w-12 h-12 text-[var(--hg-gold)] opacity-15" />
                                    <div className="flex gap-0.5 mb-5">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-[var(--hg-gold)] text-[var(--hg-gold)]" />
                                        ))}
                                    </div>
                                    <p className="font-editorial text-lg md:text-xl text-white/85 leading-relaxed italic min-h-[120px]">&ldquo;{t.message}&rdquo;</p>
                                    <div className="mt-6 pt-5 border-t border-white/10">
                                        <div className="font-display text-base text-white tracking-wide">{t.client_name}</div>
                                        <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--hg-gold)] mt-1">{t.client_title} · {t.country}</div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center text-white/55 py-10">{t('testi.loading', 'Loading client voices…')}</div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
