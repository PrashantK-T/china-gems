import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { adminLogin } from '../lib/api';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter your credentials.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await adminLogin(email, password);
            localStorage.setItem('hg_admin_token', res.access_token);
            localStorage.setItem('hg_admin_name', res.admin.name || 'Admin');
            toast.success('Welcome back, ' + (res.admin.name || 'Admin'));
            navigate('/admin');
        } catch (err) {
            toast.error(err?.response?.data?.detail || 'Invalid credentials');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden hg-hero-overlay">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                    <span
                        key={i}
                        className="hg-particle"
                        style={{
                            left: `${(i * 7.7) % 100}%`,
                            animationDuration: `${12 + (i % 4) * 2}s`,
                            animationDelay: `${-(i * 0.7) % 10}s`,
                        }}
                    />
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md mx-4 rounded-[28px] hg-bg-glass-strong p-8 md:p-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-[var(--hg-gold)]" />
                        <span className="font-display text-lg tracking-[0.22em] hg-gold-text font-semibold">HUANG GEMS</span>
                    </div>
                    <h1 className="font-display text-2xl md:text-3xl text-white font-semibold tracking-wide">Admin Console</h1>
                    <p className="text-xs tracking-[0.22em] uppercase text-white/55 mt-2">Authorized Personnel Only</p>
                </div>
                <form onSubmit={handleSubmit} data-testid="admin-login-form" className="space-y-5">
                    <label className="block">
                        <span className="block text-[10px] tracking-[0.26em] uppercase text-white/55 mb-2">Email</span>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                data-testid="admin-login-email"
                                placeholder="admin@huanggems.com"
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)] transition-colors"
                                required
                            />
                        </div>
                    </label>
                    <label className="block">
                        <span className="block text-[10px] tracking-[0.26em] uppercase text-white/55 mb-2">Password</span>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                data-testid="admin-login-password"
                                placeholder="••••••••"
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)] transition-colors"
                                required
                            />
                        </div>
                    </label>
                    <button
                        type="submit"
                        disabled={submitting}
                        data-testid="admin-login-submit-button"
                        className="hg-shine w-full inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[12px] tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] transition-colors shadow-[0_18px_60px_rgba(212,175,55,0.22)] disabled:opacity-60"
                    >
                        {submitting ? 'Authenticating…' : 'Enter the Vault'} <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
                <div className="mt-7 text-center">
                    <a href="/" className="text-xs tracking-[0.22em] uppercase text-white/45 hover:text-[var(--hg-gold)] transition-colors">
                        ← Back to Portfolio
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
