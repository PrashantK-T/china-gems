import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, MessageCircle, Instagram, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { submitInquiry } from '../lib/api';
import { CONTACT, BRAND } from '../lib/constants';
import { useLang } from '../lib/LangContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

function WeChatQRDialog({ open, onOpenChange }) {
    const { t } = useLang();
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT.wechatId);
            setCopied(true);
            toast.success(t('contact.copiedToast'));
            setTimeout(() => setCopied(false), 2200);
        } catch {
            toast.error('Could not copy. Please copy manually.');
        }
    };
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=050505&color=D4AF37&data=${encodeURIComponent('weixin://contacts/profile/' + CONTACT.wechatId)}`;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm bg-[#0B0F1A] border-[rgba(212,175,55,0.32)]">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl text-center text-white tracking-wide">{t('contact.wechatTitle')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-5 py-4">
                    <div className="p-3 rounded-2xl bg-black border border-[rgba(212,175,55,0.3)]">
                        <img src={qrUrl} alt="WeChat QR" className="w-56 h-56" />
                    </div>
                    <div className="text-center">
                        <div className="text-xs tracking-[0.26em] uppercase text-white/55">{t('contact.wechatId')}</div>
                        <div className="font-display text-lg text-[var(--hg-gold)] mt-1">{CONTACT.wechatId}</div>
                    </div>
                    <button
                        onClick={handleCopy}
                        data-testid="contact-copy-wechat-id-button"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase font-medium bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? t('contact.copied') : t('contact.copy')}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export const Contact = ({ openInquireSignal = 0 }) => {
    const { t } = useLang();
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [showWeChat, setShowWeChat] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.error(t('contact.form.errFill'));
            return;
        }
        setSubmitting(true);
        try {
            await submitInquiry({
                name: form.name,
                email: form.email,
                phone: form.phone || null,
                message: form.message,
                preferred_channel: 'email',
                product_type: 'general',
            });
            toast.success(t('contact.form.ok'));
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            toast.error(err?.response?.data?.detail || t('contact.form.fail'));
        } finally {
            setSubmitting(false);
        }
    };

    const whatsappLink = `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello HUANG GEMS, I would like to inquire about a private viewing.')}`;

    return (
        <section id="contact" data-testid="contact-section" className="relative py-20 md:py-28 lg:py-32 hg-spotlight">
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="text-xs tracking-[0.32em] uppercase text-white/55 mb-3">{t('contact.eyebrow')}</div>
                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                        <span className="text-white">{t('contact.title1')}</span>
                        <span className="hg-gold-text">{t('contact.title2')}</span>
                    </h2>
                    <p className="mt-4 md:mt-6 font-editorial text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        {t('contact.intro')}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Direct channels */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8 }}
                        className="space-y-5"
                    >
                        <h3 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-6">{t('contact.directChannels')}</h3>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            data-testid="contact-whatsapp-button"
                            className="group flex items-center gap-5 rounded-2xl hg-bg-glass-strong p-5 md:p-6 hover:border-[#25D366] transition-colors"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                                <Phone className="w-6 h-6 text-[#25D366]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] tracking-[0.26em] uppercase text-white/55">{t('contact.channels.whatsapp')}</div>
                                <div className="font-display text-base md:text-lg text-white tracking-wide mt-0.5">{CONTACT.whatsappDisplay}</div>
                            </div>
                            <Send className="w-5 h-5 text-white/40 group-hover:text-[var(--hg-gold)] group-hover:translate-x-1 transition-all" />
                        </a>

                        <button
                            onClick={() => setShowWeChat(true)}
                            data-testid="contact-wechat-qr-button"
                            className="w-full text-left group flex items-center gap-5 rounded-2xl hg-bg-glass-strong p-5 md:p-6 hover:border-[#07C160] transition-colors"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#07C160]/10 flex items-center justify-center group-hover:bg-[#07C160]/20 transition-colors">
                                <MessageCircle className="w-6 h-6 text-[#07C160]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] tracking-[0.26em] uppercase text-white/55">{t('contact.channels.wechat')}</div>
                                <div className="font-display text-base md:text-lg text-white tracking-wide mt-0.5">{CONTACT.wechatId}</div>
                            </div>
                            <Send className="w-5 h-5 text-white/40 group-hover:text-[var(--hg-gold)] group-hover:translate-x-1 transition-all" />
                        </button>

                        <a
                            href={CONTACT.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            data-testid="contact-instagram-button"
                            className="group flex items-center gap-5 rounded-2xl hg-bg-glass-strong p-5 md:p-6 hover:border-[#E1306C] transition-colors"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#E1306C]/10 flex items-center justify-center group-hover:bg-[#E1306C]/20 transition-colors">
                                <Instagram className="w-6 h-6 text-[#E1306C]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] tracking-[0.26em] uppercase text-white/55">{t('contact.channels.instagram')}</div>
                                <div className="font-display text-base md:text-lg text-white tracking-wide mt-0.5">@{CONTACT.instagram}</div>
                            </div>
                            <Send className="w-5 h-5 text-white/40 group-hover:text-[var(--hg-gold)] group-hover:translate-x-1 transition-all" />
                        </a>

                        <a
                            href={`mailto:${CONTACT.email}`}
                            className="group flex items-center gap-5 rounded-2xl hg-bg-glass-strong p-5 md:p-6 hover:border-[var(--hg-gold)] transition-colors"
                        >
                            <div className="w-14 h-14 rounded-full bg-[var(--hg-gold)]/10 flex items-center justify-center group-hover:bg-[var(--hg-gold)]/20 transition-colors">
                                <Mail className="w-6 h-6 text-[var(--hg-gold)]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] tracking-[0.26em] uppercase text-white/55">{t('contact.channels.email')}</div>
                                <div className="font-display text-base md:text-lg text-white tracking-wide mt-0.5">{CONTACT.email}</div>
                            </div>
                            <Send className="w-5 h-5 text-white/40 group-hover:text-[var(--hg-gold)] group-hover:translate-x-1 transition-all" />
                        </a>

                        <div className="flex items-center gap-3 text-sm text-white/65 pt-3">
                            <MapPin className="w-4 h-4 text-[var(--hg-gold)]" />
                            {CONTACT.address}
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        onSubmit={handleSubmit}
                        data-testid="contact-form"
                        className="rounded-[24px] hg-bg-glass-strong p-6 md:p-8 lg:p-10 space-y-5"
                    >
                        <h3 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-2">{t('contact.form.title')}</h3>
                        <p className="text-sm text-white/65">{t('contact.form.sub')}</p>

                        <FormField label={t('contact.form.name')} required>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                data-testid="contact-form-name"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)] transition-colors"
                                placeholder={t('contact.form.namePh')}
                                required
                            />
                        </FormField>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <FormField label={t('contact.form.email')} required>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    data-testid="contact-form-email"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)] transition-colors"
                                    placeholder={t('contact.form.emailPh')}
                                    required
                                />
                            </FormField>
                            <FormField label={t('contact.form.phone')}>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    data-testid="contact-form-phone"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)] transition-colors"
                                    placeholder={t('contact.form.phonePh')}
                                />
                            </FormField>
                        </div>

                        <FormField label={t('contact.form.message')} required>
                            <textarea
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                data-testid="contact-form-message"
                                rows={5}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)] transition-colors resize-none"
                                placeholder={t('contact.form.messagePh')}
                                required
                            />
                        </FormField>

                        <button
                            type="submit"
                            disabled={submitting}
                            data-testid="contact-form-submit-button"
                            className="hg-shine w-full inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[12px] tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] transition-colors shadow-[0_18px_60px_rgba(212,175,55,0.22)] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? t('contact.form.sending') : t('contact.form.submit')} <Send className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] tracking-[0.18em] uppercase text-white/40 text-center">
                            {t('contact.form.confidential')}{BRAND.name}
                        </p>
                    </motion.form>
                </div>
            </div>
            <WeChatQRDialog open={showWeChat} onOpenChange={setShowWeChat} />
        </section>
    );
};

function FormField({ label, required, children }) {
    return (
        <label className="block">
            <span className="block text-[10px] tracking-[0.26em] uppercase text-white/55 mb-2">{label}</span>
            {children}
        </label>
    );
}

export default Contact;
