import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useLang } from '../lib/LangContext';

const USER_UPLOADS = {
    rough_ruby: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/i0mmhhdv_gem-2.jpeg',
    cut_ruby: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/ogq516g6_gem-4.jpeg',
    sapphire_ring: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/rzwgbhzu_gem-5.jpeg',
    sapphire_necklace: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/j1ujg5bv_jwel-1.jpeg',
    bridal_set: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/4zks23bn_jwel-2.jpeg',
};

const FEATURED = [
    {
        id: 'fa1',
        title: 'Mozambique Pigeon Blood Ruby',
        meta: '3.05ct · Non-Heated · GIA',
        tag: 'Extremely Rare',
        image: USER_UPLOADS.cut_ruby,
        size: 'large',
        accent: 'ruby',
    },
    {
        id: 'fa2',
        title: 'Burmese Rough Ruby Crystal',
        meta: '18.7ct · Mogok · SSEF',
        tag: 'Museum-Grade',
        image: USER_UPLOADS.rough_ruby,
        accent: 'ruby',
    },
    {
        id: 'fa3',
        title: 'Ceylon Royal Blue Sapphire Ring',
        meta: '2.15ct · Platinum · GIA',
        tag: 'Featured',
        image: USER_UPLOADS.sapphire_ring,
        accent: 'sapphire',
    },
    {
        id: 'fa4',
        title: 'Imperial Sapphire ',
        meta: '84.5ct · White Gold + Platinum',
        tag: 'Atelier Piece',
        image: USER_UPLOADS.sapphire_necklace,
        accent: 'sapphire',
    },
    {
        id: 'fa5',
        title: 'Royal Bridal Suite —  Cascade',
        meta: '12.8ct · 18K Gold · Heritage',
        tag: 'Bridal Collection',
        image: USER_UPLOADS.bridal_set,
        accent: 'gold',
    },
];

const accentRing = {
    ruby: 'group-hover:shadow-[0_30px_80px_rgba(220,38,38,0.18)]',
    sapphire: 'group-hover:shadow-[0_30px_80px_rgba(37,99,235,0.18)]',
    gold: 'group-hover:shadow-[0_30px_80px_rgba(212,175,55,0.22)]',
};

export const FeaturedShowcase = ({ onView }) => {
    const { t } = useLang();
    return (
        <section
            id="featured"
            data-testid="featured-gemstones-section"
            className="relative py-20 md:py-28 lg:py-32"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-4 text-xs tracking-[0.32em] uppercase text-white/55">
                        <span className="w-8 h-px bg-[var(--hg-gold)]" />
                        <Sparkles className="w-3 h-3 text-[var(--hg-gold)]" />
                        {t('featured.eyebrow', 'Featured Highlights')}
                        <Sparkles className="w-3 h-3 text-[var(--hg-gold)]" />
                        <span className="w-8 h-px bg-[var(--hg-gold)]" />
                    </div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('featured.title1', 'Pieces from the ')}</span>
                        <span className="hg-gold-text">{t('featured.title2', 'Vault')}</span>
                    </h2>
                    <p className="mt-4 md:mt-6 font-editorial text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        {t('featured.intro')}
                    </p>
                </motion.div>

                {/* Bento grid */}
                <div className="grid grid-cols-12 gap-4 md:gap-4">
                    {/* Hero card */}
                    <FeaturedCard item={FEATURED[0]} className="col-span-12 lg:col-span-7 lg:row-span-2" tall onView={onView} />
                    <FeaturedCard item={FEATURED[1]} className="col-span-6 lg:col-span-5" onView={onView} />
                    <FeaturedCard item={FEATURED[2]} className="col-span-6 lg:col-span-5" onView={onView} />
                    {/* <FeaturedCard item={FEATURED[3]} className="col-span-12 sm:col-span-6" onView={onView} /> */}
                    {/* <FeaturedCard item={FEATURED[4]} className="col-span-12 sm:col-span-6" onView={onView} /> */}
                </div>
            </div>
        </section>
    );
};

function FeaturedCard({ item, className = '', tall = false, onView }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative overflow-hidden rounded-[22px] hg-bg-glass-strong cursor-pointer transition-all duration-500 hover:-translate-y-1 ${accentRing[item.accent]} ${className}`}
            data-testid="featured-gemstone-card"
            onClick={() => onView && onView(item)}
        >
            {/* Image */}
            <div className={`relative ${tall ? 'aspect-[5/6] lg:aspect-auto lg:h-full' : 'aspect-[4/5]'} overflow-hidden`}>
                <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Tag */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[rgba(212,175,55,0.32)]">
                <span className="text-[10px] tracking-[0.22em] uppercase font-medium hg-gold-text">{item.tag}</span>
            </div>

            {/* gold shine sweep */}
            <span className="hg-shine absolute inset-0 pointer-events-none" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <h3 className={`font-display ${tall ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg md:text-xl'} text-white font-semibold leading-tight tracking-wide`}>
                    {item.title}
                </h3>
                <p className="mt-2 text-[11px] md:text-xs tracking-[0.22em] uppercase text-white/65">{item.meta}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-[11px] md:text-xs tracking-[0.22em] uppercase text-[var(--hg-gold)] opacity-90 group-hover:opacity-100">
                    View Details <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
            </div>
        </motion.div>
    );
}

export default FeaturedShowcase;
