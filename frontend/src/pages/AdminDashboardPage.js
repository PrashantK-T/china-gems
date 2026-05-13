import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Gem, Crown, Inbox, Tag, LogOut, Sparkles, Menu, X } from 'lucide-react';
import AdminDashboardOverview from '../components/admin/AdminDashboardOverview';
import AdminGemstones from '../components/admin/AdminGemstones';
import AdminJewelry from '../components/admin/AdminJewelry';
import AdminInquiries from '../components/admin/AdminInquiries';
import AdminOffers from '../components/admin/AdminOffers';
import { toast } from 'sonner';

const NAV = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, testid: 'admin-nav-dashboard' },
    { to: '/admin/gemstones', label: 'Gemstones', icon: Gem, testid: 'admin-nav-gemstones' },
    { to: '/admin/jewelry', label: 'Jewelry', icon: Crown, testid: 'admin-nav-jewelry' },
    { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox, testid: 'admin-nav-inquiries' },
    { to: '/admin/offers', label: 'Offers', icon: Tag, testid: 'admin-nav-offers' },
];

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('Admin');
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setName(localStorage.getItem('hg_admin_name') || 'Admin');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('hg_admin_token');
        localStorage.removeItem('hg_admin_name');
        toast.success('Logged out');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen flex bg-[var(--hg-bg-0)]">
            {/* Sidebar */}
            <aside
                data-testid="admin-sidebar"
                className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0B0F1A] border-r border-white/10 flex flex-col transition-transform duration-300 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[var(--hg-gold)]" />
                        <div>
                            <div className="font-display text-base tracking-[0.18em] hg-gold-text font-semibold leading-none">HUANG GEMS</div>
                            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mt-1">Admin Console</div>
                        </div>
                    </div>
                    <button className="lg:hidden text-white/65" onClick={() => setMobileOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {NAV.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setMobileOpen(false)}
                                data-testid={item.testid}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                                        isActive
                                            ? 'bg-[var(--hg-gold)]/15 text-[var(--hg-gold)] border border-[rgba(212,175,55,0.3)]'
                                            : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                <span className="tracking-wider">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <div className="px-2 mb-3">
                        <div className="text-xs text-white/55 tracking-[0.18em] uppercase">Signed in as</div>
                        <div className="font-display text-sm text-white mt-1">{name}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        data-testid="admin-logout-button"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs tracking-[0.22em] uppercase text-white/75 hover:text-[var(--hg-gold)] bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Content */}
            <main className="flex-1 min-w-0">
                <header className="sticky top-0 z-20 bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/10 px-5 md:px-8 py-4 flex items-center justify-between">
                    <button className="lg:hidden text-white/85" onClick={() => setMobileOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="font-display text-base md:text-lg tracking-wider text-white">Admin Console</div>
                    <a href="/" target="_blank" rel="noreferrer" className="text-xs tracking-[0.22em] uppercase text-white/55 hover:text-[var(--hg-gold)] transition-colors">
                        View Site →
                    </a>
                </header>
                <div className="p-5 md:p-8 lg:p-10">
                    <Routes>
                        <Route path="/" element={<AdminDashboardOverview />} />
                        <Route path="gemstones" element={<AdminGemstones />} />
                        <Route path="jewelry" element={<AdminJewelry />} />
                        <Route path="inquiries" element={<AdminInquiries />} />
                        <Route path="offers" element={<AdminOffers />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
