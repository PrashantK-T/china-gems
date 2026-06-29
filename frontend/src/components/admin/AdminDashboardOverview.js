import { useEffect, useState } from 'react';
import { Gem, Crown, Inbox, Sparkles, MailOpen, Star } from 'lucide-react';
import { adminStats } from '../../lib/api';

const CARDS = [
    { key: 'total_gemstones', label: 'Gemstones', icon: Gem, color: 'var(--hg-emerald)' },
    { key: 'total_jewelry', label: 'Jewelry Pieces', icon: Crown, color: 'var(--hg-gold)' },
    { key: 'total_inquiries', label: 'Total Inquiries', icon: Inbox, color: 'var(--hg-sapphire)' },
    { key: 'pending_inquiries', label: 'New / Pending', icon: MailOpen, color: 'var(--hg-ruby)' },
    { key: 'contacted_inquiries', label: 'Contacted', icon: Sparkles, color: 'var(--hg-emerald)' },
    { key: 'featured_count', label: 'Featured Items', icon: Star, color: 'var(--hg-gold)' },
];

export default function AdminDashboardOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminStats()
            .then(setStats)
            .catch(() => setStats({}))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div data-testid="admin-dashboard-overview">
            
            <div className="mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide font-semibold">Dashboard</h1>
                <p className="text-sm text-white/55 mt-1">Welcome back to the HUANG GEMS admin console.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {CARDS.map((card) => {
                    const Icon = card.icon;
                    const value = stats?.[card.key] ?? 0;
                    console.log("sts",stats)
                    console.log("card",card)
                    return (
                        <div
                            key={card.key}
                            className="rounded-2xl hg-bg-glass-strong p-5 md:p-6"
                            data-testid={`admin-stat-${card.key}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] tracking-[0.26em] uppercase text-white/55">{card.label}</span>
                                <Icon className="w-4 h-4" style={{ color: card.color }} />
                            </div>
                            <div className="font-display text-3xl md:text-4xl text-white font-semibold">
                                {loading ? '—' : value}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-10 rounded-2xl hg-bg-glass-strong p-5 md:p-7">
                <h2 className="font-display text-lg md:text-xl text-white tracking-wide">Quick Actions</h2>
                <p className="text-sm text-white/55 mt-1">Use the left sidebar to manage gemstones, jewelry pieces, inquiries, and offers.</p>
                <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'New Gemstone', href: '/admin/gemstones' },
                        { label: 'New Jewelry', href: '/admin/jewelry' },
                        { label: 'New Offer', href: '/admin/offers' },
                        { label: 'Open Inbox', href: '/admin/inquiries' },
                    ].map((q) => (
                        <a
                            key={q.label}
                            href={q.href}
                            className="rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[var(--hg-gold)] px-4 py-3 text-sm text-white/85 hover:text-[var(--hg-gold)] transition-colors text-center"
                        >
                            {q.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
