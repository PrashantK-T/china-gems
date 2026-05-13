import { useState } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Globe2 } from 'lucide-react';
import { GLOBAL_CITIES } from '../lib/constants';
import { useLang } from '../lib/LangContext';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const GlobalPresence = () => {
    const { t } = useLang();
    const [hovered, setHovered] = useState(null);

    return (
        <section
            id="global-presence"
            data-testid="global-presence-section"
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
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('global.eyebrow', 'Worldwide')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('global.title1', 'Global ')}</span>
                        <span className="hg-gold-text">{t('global.title2', 'Presence')}</span>
                    </h2>
                    <p className="mt-4 md:mt-6 font-editorial text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        {t('global.intro')}
                    </p>
                </motion.div>

                <div className="relative rounded-3xl hg-bg-glass overflow-hidden">
                    <div className="relative aspect-[16/9] w-full">
                        <ComposableMap
                            projectionConfig={{ scale: 155 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="#0a0e18"
                                            stroke="rgba(212,175,55,0.18)"
                                            strokeWidth={0.4}
                                            style={{
                                                default: { outline: 'none' },
                                                hover: { fill: '#11182b', outline: 'none' },
                                                pressed: { outline: 'none' },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                            {GLOBAL_CITIES.map((city) => (
                                <Marker
                                    key={city.code}
                                    coordinates={city.coords}
                                    onMouseEnter={() => setHovered(city)}
                                    onMouseLeave={() => setHovered(null)}
                                    data-testid={`global-marker-${city.code}`}
                                >
                                    <circle r={5} fill="#D4AF37" opacity={0.85} />
                                    <circle r={9} fill="#D4AF37" opacity={0.18}>
                                        <animate attributeName="r" from="6" to="14" dur="2.5s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" from="0.35" to="0" dur="2.5s" repeatCount="indefinite" />
                                    </circle>
                                    <text
                                        textAnchor="middle"
                                        y={-10}
                                        style={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: 9,
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                            fill: 'rgba(255,255,255,0.7)',
                                        }}
                                    >
                                        {city.name}
                                    </text>
                                </Marker>
                            ))}
                        </ComposableMap>
                    </div>

                    {hovered && (
                        <div className="absolute top-4 left-4 px-4 py-2.5 rounded-full hg-bg-glass-strong border border-[rgba(212,175,55,0.4)] flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-[var(--hg-gold)]" />
                            <span className="font-display text-sm text-white tracking-wide">{hovered.name}</span>
                            <span className="text-xs text-white/55">· {hovered.country}</span>
                        </div>
                    )}
                </div>

                <div className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {GLOBAL_CITIES.slice(0, 10).map((city) => (
                        <div key={city.code} className="text-center">
                            <div className="font-display text-base md:text-lg text-white tracking-wide">{city.name}</div>
                            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mt-0.5">{city.country}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GlobalPresence;
