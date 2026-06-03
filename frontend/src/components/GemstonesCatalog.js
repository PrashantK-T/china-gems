import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, Search, Filter } from 'lucide-react';
import { fetchGemstones } from '../lib/api';
import { GEM_FAMILIES } from '../lib/constants';
import { useLang } from '../lib/LangContext';
import GemstoneCard from './GemstoneCard';

const TYPES = ['precious', 'semi-precious', 'organic'];
const RARITIES = ['Common', 'Rare', 'Very Rare', 'Extremely Rare'];
const CERTIFICATIONS = ['AIGI', 'GUILD', 'GRSG'];
const PRICE_TIERS = ['Premium', 'Luxury', 'Ultra-Luxury'];

const initialFilters = {
    type: '',
    gemstone_family: '',
    rarity: '',
    certification: '',
    natural: '',
    price_tier: '',
    search: '',
};

export const GemstonesCatalog = ({ onView }) => {
    const { t } = useLang();
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(initialFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        const params = {};
        Object.entries(filters).forEach(([k, v]) => {
            if (v !== '' && v !== null) {
                params[k] = v === 'true' ? true : v === 'false' ? false : v;
            }
        });
        fetchGemstones(params)
            .then((data) => { if (!cancelled) setGems(data || []); })
            .catch((e) => { if (!cancelled) setError(e?.message || 'Failed to load'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [filters]);

    const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
    const clearFilters = () => setFilters(initialFilters);

    const activeFilterCount = useMemo(() =>
        Object.values(filters).filter((v) => v !== '' && v !== null).length
    , [filters]);

    return (
        <section
            id="gemstones"
            data-testid="gemstones-section"
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
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('catalog.eyebrow', 'The Collection')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('catalog.title1', 'The ')}</span>
                        <span className="hg-gold-text">{t('catalog.title2', 'Gemstone Archive')}</span>
                    </h2>
                    <p className="mt-4 md:mt-6 font-editorial text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        {t('catalog.intro')}
                    </p>
                </motion.div>

                {/* Filter bar */}
                <div className="flex flex-wrap items-center gap-3 mb-8 md:mb-10">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        data-testid="catalog-toggle-filters-button"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] tracking-[0.18em] uppercase font-medium hg-bg-glass border-white/15 hover:border-[var(--hg-gold)] text-white transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        {t('catalog.filters', 'Filters')}
                        {activeFilterCount > 0 && (
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-[var(--hg-gold)] text-black text-[10px] font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            placeholder={t('catalog.search', 'Search by name, origin, family…')}
                            data-testid="catalog-search-input"
                            className="w-full rounded-full hg-bg-glass border-white/15 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--hg-gold)] transition-colors"
                        />
                    </div>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            data-testid="catalog-clear-filters-button"
                            className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.18em] uppercase text-white/60 hover:text-[var(--hg-gold)] transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> {t('catalog.clear', 'Clear')}
                        </button>
                    )}

                    <div className="ml-auto text-xs tracking-[0.22em] uppercase text-white/55">
                        {gems.length} {gems.length === 1 ? t('catalog.piece', 'piece') : t('catalog.pieces', 'pieces')}
                    </div>
                </div>

                {/* Filters panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 rounded-3xl hg-bg-glass-strong p-5 md:p-7"
                        data-testid="catalog-filters-panel"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <FilterSelect label="Type" value={filters.type} onChange={(v) => setFilter('type', v)} options={TYPES} testid="filter-type" />
                            <FilterSelect label="Family" value={filters.gemstone_family} onChange={(v) => setFilter('gemstone_family', v)} options={GEM_FAMILIES} testid="filter-family" />
                            <FilterSelect label="Rarity" value={filters.rarity} onChange={(v) => setFilter('rarity', v)} options={RARITIES} testid="filter-rarity" />
                            <FilterSelect label="Certification" value={filters.certification} onChange={(v) => setFilter('certification', v)} options={CERTIFICATIONS} testid="filter-certification" />
                            <FilterSelect label="Price Tier" value={filters.price_tier} onChange={(v) => setFilter('price_tier', v)} options={PRICE_TIERS} testid="filter-price" />
                            <FilterSelect
                                label="Natural"
                                value={filters.natural}
                                onChange={(v) => setFilter('natural', v)}
                                options={['true', 'false']}
                                labels={{ true: 'Natural', false: 'Lab-grown' }}
                                testid="filter-natural"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-product rounded-[22px] hg-bg-glass animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-white/55">Failed to load — {error}</div>
                ) : gems.length === 0 ? (
                    <div className="text-center py-20">
                        <Filter className="w-12 h-12 mx-auto text-white/30 mb-4" />
                        <p className="text-white/55 mb-4">No gemstones match your filters.</p>
                        <button
                            onClick={clearFilters}
                            data-testid="catalog-empty-clear-button"
                            className="text-[12px] tracking-[0.22em] uppercase text-[var(--hg-gold)] hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {gems.map((gem) => (
                            <GemstoneCard key={gem.id} gem={gem} onView={() => onView(gem, 'gemstone')} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

function FilterSelect({ label, value, onChange, options, labels = {}, testid }) {
    return (
        <div>
            <label className="block text-[10px] tracking-[0.26em] uppercase text-white/55 mb-2">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid={testid}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)] transition-colors cursor-pointer"
            >
                <option value="">All</option>
                {options.map((opt) => (
                    <option key={opt} value={opt} className="bg-black text-white">
                        {labels[opt] || opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default GemstonesCatalog;
