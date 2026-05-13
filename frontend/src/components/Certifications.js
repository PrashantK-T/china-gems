import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { fetchCertifications } from '../lib/api';
import { useLang } from '../lib/LangContext';

export const Certifications = () => {
    const { t } = useLang();
    const [certs, setCerts] = useState([]);

    useEffect(() => {
        fetchCertifications().then(setCerts).catch(() => setCerts([]));
    }, []);

    return (
        <section
            id="certifications"
            data-testid="certifications-section"
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
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('certs.eyebrow', 'Authentication & Provenance')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('certs.title1', 'Certified by the ')}</span>
                        <span className="hg-gold-text">{t('certs.title2', "World's Finest")}</span>
                    </h2>
                    <p className="mt-4 md:mt-6 font-editorial text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        {t('certs.intro')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
                    {certs.map((cert, idx) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 16, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative rounded-[20px] hg-bg-glass-strong p-6 md:p-7 text-center hover:border-[rgba(212,175,55,0.45)] transition-colors duration-500"
                            data-testid="certification-card"
                        >
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[rgba(212,175,55,0.35)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-7 h-7 text-[var(--hg-gold)]" />
                                </div>
                            </div>
                            <div className="font-display text-2xl text-white tracking-[0.18em] font-semibold mb-1">{cert.name}</div>
                            <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--hg-gold)] mb-3">{cert.full_name}</div>
                            <p className="text-xs text-white/65 leading-relaxed">{cert.description}</p>
                            <span className="hg-shine absolute inset-0 pointer-events-none rounded-[20px]" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
