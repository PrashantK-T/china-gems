import { motion } from 'framer-motion';
import { Eye, MapPin, Award, Sparkles } from 'lucide-react';

const rarityColors = {
    'Common': 'text-white/70 border-white/15',
    'Rare': 'text-[var(--hg-emerald)] border-[rgba(16,185,129,0.4)]',
    'Very Rare': 'text-[var(--hg-sapphire)] border-[rgba(37,99,235,0.4)]',
    'Extremely Rare': 'text-[var(--hg-gold)] border-[rgba(212,175,55,0.6)]',
};

export const GemstoneCard = ({ gem, onView }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-[22px] hg-bg-glass cursor-pointer hover:border-[rgba(212,175,55,0.32)] transition-colors duration-500"
            data-testid="catalog-product-card"
            onClick={() => onView && onView(gem)}
        >
            {/* Media */}
            <div className="relative aspect-product overflow-hidden">
                <img
                    src={gem.images?.[0] || ''}
                    alt={gem.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <span className="hg-shine absolute inset-0 pointer-events-none" />

                {/* Rarity badge */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border ${rarityColors[gem.rarity] || rarityColors.Common}`}>
                    <span className="text-[9px] tracking-[0.22em] uppercase font-medium">{gem.rarity}</span>
                </div>

                {/* Featured */}
                {gem.featured && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--hg-gold)] flex items-center justify-center shadow-[0_8px_24px_rgba(212,175,55,0.45)]">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                    </div>
                )}

                {/* Quick view */}
                <button
                    onClick={(e) => { e.stopPropagation(); onView && onView(gem); }}
                    data-testid="catalog-quick-view-button"
                    className="absolute bottom-3 left-3 right-3 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--hg-gold)] text-black py-2.5 text-[11px] tracking-[0.22em] uppercase font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                >
                    <Eye className="w-3.5 h-3.5" /> View Details
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] tracking-[0.26em] uppercase text-[var(--hg-gold)]">{gem.gemstone_family}</span>
                    <span className="text-[10px] tracking-[0.22em] uppercase text-white/45">{gem.price_tier}</span>
                </div>
                <h3 className="font-display text-base md:text-lg text-white leading-tight tracking-wide line-clamp-2 min-h-[2.6em]">
                    {gem.name}
                </h3>
                <div className="mt-3 flex items-center gap-3 text-[10px] tracking-[0.18em] uppercase text-white/60">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {(gem.origin || '').split(',')[0]}</span>
                    <span className="w-px h-3 bg-white/15" />
                    <span>{gem.weight_carat}ct</span>
                    <span className="w-px h-3 bg-white/15" />
                    <span className="inline-flex items-center gap-1"><Award className="w-3 h-3" /> {gem.certification?.split(' ')[0] || 'In-House'}</span>
                </div>
            </div>
        </motion.article>
    );
};

export default GemstoneCard;
