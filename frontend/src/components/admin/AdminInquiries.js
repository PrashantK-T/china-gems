import { useEffect, useState } from 'react';
import { Mail, Phone, MessageCircle, Instagram, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    adminListInquiries,
    adminUpdateInquiry,
    adminDeleteInquiry,
} from '../../lib/api';

const STATUSES = [
    { id: '', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'closed', label: 'Closed' },
];

const channelIcon = {
    whatsapp: Phone,
    wechat: MessageCircle,
    instagram: Instagram,
    email: Mail,
};

export default function AdminInquiries() {
    const [items, setItems] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const load = async () => {
        setLoading(true);
        try { setItems(await adminListInquiries(statusFilter || undefined)); }
        catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [statusFilter]);

    const handleUpdateStatus = async (id, status) => {
        try {
            const updated = await adminUpdateInquiry(id, status);
            toast.success('Status updated');
            setItems((prev) => prev.map((x) => x.id === id ? updated : x));
            if (selected?.id === id) setSelected(updated);
        } catch { toast.error('Failed to update'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry?')) return;
        try { await adminDeleteInquiry(id); toast.success('Deleted'); setSelected(null); load(); }
        catch { toast.error('Failed to delete'); }
    };

    return (
        <div data-testid="admin-inquiries-page">
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide font-semibold flex-1">Inquiries</h1>
                <div className="flex gap-2" data-testid="admin-inquiry-status-filter">
                    {STATUSES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setStatusFilter(s.id)}
                            data-testid={`admin-inquiry-filter-${s.id || 'all'}`}
                            className={`rounded-full px-3 py-1.5 text-[10px] tracking-[0.22em] uppercase font-medium transition-colors ${
                                statusFilter === s.id
                                    ? 'bg-[var(--hg-gold)] text-black'
                                    : 'bg-white/[0.04] text-white/65 hover:text-white border border-white/10'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-5">
                <div className="lg:col-span-2 rounded-2xl hg-bg-glass-strong overflow-hidden">
                    <div data-testid="admin-inquiry-list" className="max-h-[640px] overflow-y-auto">
                        {loading ? (
                            <div className="p-10 text-center text-white/45">Loading…</div>
                        ) : items.length === 0 ? (
                            <div className="p-10 text-center text-white/45">No inquiries</div>
                        ) : items.map((inq) => {
                            const Icon = channelIcon[inq.preferred_channel] || Mail;
                            const dot = inq.status === 'new' ? 'bg-[var(--hg-ruby)]' : inq.status === 'contacted' ? 'bg-[var(--hg-gold)]' : 'bg-white/25';
                            return (
                                <button
                                    key={inq.id}
                                    onClick={() => setSelected(inq)}
                                    className={`w-full text-left flex items-center gap-3 p-4 border-b border-white/5 transition-colors ${
                                        selected?.id === inq.id ? 'bg-[var(--hg-gold)]/8' : 'hover:bg-white/[0.04]'
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                                    <Icon className="w-4 h-4 text-white/55" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white truncate">{inq.name}</div>
                                        <div className="text-xs text-white/55 truncate">{inq.product_name || inq.email}</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/40" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {selected ? (
                        <div className="rounded-2xl hg-bg-glass-strong p-6 md:p-7" data-testid="admin-inquiry-detail">
                            <div className="flex items-start justify-between gap-4 mb-5">
                                <div>
                                    <h2 className="font-display text-xl md:text-2xl text-white tracking-wide">{selected.name}</h2>
                                    <div className="text-xs text-white/55 mt-1">{new Date(selected.created_at).toLocaleString()}</div>
                                </div>
                                <button onClick={() => handleDelete(selected.id)} className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/15 text-white/65 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 mb-5">
                                <Pill label="Email" value={selected.email} />
                                <Pill label="Phone" value={selected.phone || '—'} />
                                <Pill label="Channel" value={selected.preferred_channel} />
                                <Pill label="Status" value={selected.status} accent />
                            </div>

                            {selected.product_name && (
                                <div className="mb-5 p-4 rounded-xl bg-[var(--hg-gold)]/8 border border-[rgba(212,175,55,0.22)]">
                                    <div className="text-[10px] tracking-[0.26em] uppercase text-[var(--hg-gold)] mb-1">Re: Product</div>
                                    <div className="text-sm text-white">{selected.product_name}</div>
                                </div>
                            )}

                            <div className="mb-6">
                                <div className="text-[10px] tracking-[0.26em] uppercase text-white/55 mb-2">Message</div>
                                <div className="rounded-xl bg-black/40 border border-white/8 p-4 text-sm text-white/85 leading-relaxed whitespace-pre-wrap">{selected.message}</div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleUpdateStatus(selected.id, 'new')} data-testid="admin-set-new" className="rounded-full px-4 py-2 text-[10px] tracking-[0.22em] uppercase font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white/75 border border-white/10">Mark New</button>
                                <button onClick={() => handleUpdateStatus(selected.id, 'contacted')} data-testid="admin-set-contacted" className="rounded-full px-4 py-2 text-[10px] tracking-[0.22em] uppercase font-medium bg-[var(--hg-gold)]/15 hover:bg-[var(--hg-gold)]/22 text-[var(--hg-gold)] border border-[rgba(212,175,55,0.32)]">Mark Contacted</button>
                                <button onClick={() => handleUpdateStatus(selected.id, 'closed')} data-testid="admin-set-closed" className="rounded-full px-4 py-2 text-[10px] tracking-[0.22em] uppercase font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white/75 border border-white/10">Mark Closed</button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl hg-bg-glass-strong p-10 text-center text-white/45">
                            Select an inquiry to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Pill({ label, value, accent }) {
    return (
        <div className={`rounded-xl px-4 py-3 ${accent ? 'bg-[var(--hg-gold)]/8 border border-[rgba(212,175,55,0.22)]' : 'bg-black/30 border border-white/8'}`}>
            <div className="text-[9px] tracking-[0.26em] uppercase text-white/55">{label}</div>
            <div className={`text-sm font-medium mt-0.5 truncate ${accent ? 'text-[var(--hg-gold)] capitalize' : 'text-white'}`}>{value}</div>
        </div>
    );
}
