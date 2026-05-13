import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Award, Sparkles, Phone, MessageCircle, Instagram, Diamond, Layers } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { toast } from 'sonner';
import { CONTACT } from '../lib/constants';

export const ProductDetailModal = ({ item, type, open, onClose }) => {
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (open) setActiveImage(0);
    }, [open, item?.id]);

    if (!item) return null;

    const isGem = type === 'gemstone' || item.gemstone_family;

    const inquiryMessage = `Hello HUANG GEMS, I would like to inquire about: ${item.name}. Please share more details.`;
    const whatsappLink = `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(inquiryMessage)}`;

    const copyWeChat = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT.wechatId);
            toast.success(`WeChat ID "${CONTACT.wechatId}" copied. Open WeChat to add us.`);
        } catch {
            toast.error('Could not copy. WeChat ID: ' + CONTACT.wechatId);
        }
    };

    const specs = isGem ? [
        { label: 'Family', value: item.gemstone_family },
        { label: 'Type', value: item.type },
        { label: 'Origin', value: item.origin },
        { label: 'Shape', value: item.shape },
        { label: 'Cut', value: item.cut },
        { label: 'Color', value: item.color },
        { label: 'Weight', value: `${item.weight_carat} ct` },
        { label: 'Clarity', value: item.clarity },
        { label: 'Transparency', value: item.transparency },
        { label: 'Treatment', value: item.treatment },
        { label: 'Hardness', value: item.hardness ? `${item.hardness} Mohs` : null },
        { label: 'Natural', value: item.natural ? 'Yes (Natural)' : 'No (Lab-grown)' },
        { label: 'Rarity', value: item.rarity },
        { label: 'Investment', value: item.investment_grade ? 'Yes' : 'Display Piece' },
        { label: 'Certification', value: item.certification },
    ].filter(s => s.value !== null && s.value !== undefined && s.value !== '') : [
        { label: 'Category', value: (item.category || '').replace('_', ' ') },
        { label: 'Metal', value: item.metal_type },
        { label: 'Primary Gemstone', value: item.primary_gemstone },
        { label: 'Total Carat Weight', value: item.total_carat ? `${item.total_carat} ct` : null },
        { label: 'Price Tier', value: item.price_tier },
        { label: 'Availability', value: item.availability },
    ].filter(s => s.value);

    const images = item.images && item.images.length > 0 ? item.images : [];

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent
                data-testid="product-detail-modal"
                className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 bg-[#0B0F1A] border-[rgba(212,175,55,0.32)] [&>button]:hidden"
            >
                <div className="grid lg:grid-cols-2 gap-0 relative">
                    <button
                        onClick={onClose}
                        data-testid="product-detail-close-button"
                        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-white/15 hover:border-[var(--hg-gold)] hover:text-[var(--hg-gold)] flex items-center justify-center text-white/85 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Gallery */}
                    <div data-testid="product-gallery" className="relative bg-black">
                        <div className="relative aspect-square lg:aspect-auto lg:h-full overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    src={images[activeImage] || ''}
                                    alt={item.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent pointer-events-none" />
                            {item.featured && (
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--hg-gold)] text-black inline-flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="text-[10px] tracking-[0.22em] uppercase font-bold">Featured</span>
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto p-4 bg-black/60">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        data-testid={`product-thumbnail-${idx}`}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                                            activeImage === idx
                                                ? 'ring-2 ring-[var(--hg-gold)] scale-105'
                                                : 'opacity-55 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt={`${item.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-6 md:p-8 lg:p-10">
                        {isGem && (
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] tracking-[0.26em] uppercase text-[var(--hg-gold)]">{item.gemstone_family}</span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span className="text-[10px] tracking-[0.22em] uppercase text-white/55">{item.rarity}</span>
                            </div>
                        )}
                        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-white tracking-wide font-semibold leading-tight">
                            {item.name}
                        </h2>
                        {(item.short_description || item.description) && (
                            <p className="mt-4 font-editorial text-base md:text-lg text-white/75 leading-relaxed">
                                {item.short_description || item.description}
                            </p>
                        )}
                        {(item.long_description && item.long_description !== item.short_description) && (
                            <p className="mt-3 text-sm text-white/65 leading-relaxed">{item.long_description}</p>
                        )}

                        {item.symbolism && (
                            <div className="mt-5 p-4 rounded-xl bg-[var(--hg-gold)]/5 border border-[rgba(212,175,55,0.22)]">
                                <div className="text-[10px] tracking-[0.26em] uppercase text-[var(--hg-gold)] mb-1">Symbolism</div>
                                <div className="text-sm text-white/85">{item.symbolism}</div>
                            </div>
                        )}

                        {/* Specs grid */}
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {specs.map((spec) => (
                                <div key={spec.label} className="rounded-xl bg-black/40 border border-white/8 p-3">
                                    <div className="text-[9px] tracking-[0.22em] uppercase text-white/50">{spec.label}</div>
                                    <div className="text-xs md:text-sm text-white font-medium mt-1">{spec.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Key highlights */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {isGem && item.origin && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/75">
                                    <MapPin className="w-3 h-3 text-[var(--hg-gold)]" /> {item.origin}
                                </span>
                            )}
                            {item.certification && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/75">
                                    <Award className="w-3 h-3 text-[var(--hg-gold)]" /> {item.certification}
                                </span>
                            )}
                            {isGem && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/75">
                                    <Diamond className="w-3 h-3 text-[var(--hg-gold)]" /> {item.weight_carat} ct
                                </span>
                            )}
                            {item.investment_grade && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--hg-gold)]/15 border border-[rgba(212,175,55,0.4)] text-xs text-[var(--hg-gold)] font-medium">
                                    <Layers className="w-3 h-3" /> Investment Grade
                                </span>
                            )}
                        </div>

                        {item.craftsmanship_notes && (
                            <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/8">
                                <div className="text-[10px] tracking-[0.26em] uppercase text-[var(--hg-gold)] mb-1.5">Atelier Notes</div>
                                <div className="text-sm text-white/80 leading-relaxed">{item.craftsmanship_notes}</div>
                            </div>
                        )}

                        {/* Inquiry CTAs */}
                        <div className="mt-7 pt-6 border-t border-white/10">
                            <div className="text-[10px] tracking-[0.32em] uppercase text-white/55 mb-3">Private Inquiry</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    data-testid="product-inquiry-whatsapp-button"
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5a] transition-colors"
                                >
                                    <Phone className="w-3.5 h-3.5" /> WhatsApp
                                </a>
                                <button
                                    onClick={copyWeChat}
                                    data-testid="product-inquiry-wechat-button"
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-semibold bg-[#07C160] text-white hover:bg-[#05a653] transition-colors"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" /> WeChat
                                </button>
                                <a
                                    href={CONTACT.instagramUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    data-testid="product-inquiry-instagram-button"
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-semibold bg-[#E1306C] text-white hover:bg-[#c91f5d] transition-colors"
                                >
                                    <Instagram className="w-3.5 h-3.5" /> Instagram
                                </a>
                            </div>
                            <p className="text-[10px] tracking-[0.22em] uppercase text-white/40 text-center mt-3">
                                All inquiries strictly confidential
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailModal;
