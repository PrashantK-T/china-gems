import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
    fetchOffers,
    adminCreateOffer,
    adminUpdateOffer,
    adminDeleteOffer,
} from '../../lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const EMPTY = {
    title: '', subtitle: '', description: '', banner_image: '',
    accent_color: '#D4AF37', link_target: '#gemstones', active: true,
};

export default function AdminOffers() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const load = async () => {
        setLoading(true);
        try { setItems(await fetchOffers()); }
        catch { toast.error('Failed to load offers'); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete "${item.title}"?`)) return;
        try { await adminDeleteOffer(item.id); toast.success('Deleted'); load(); }
        catch { toast.error('Failed to delete'); }
    };

    return (
        <div data-testid="admin-offers-page">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide font-semibold flex-1">Offers</h1>
                <button onClick={() => { setEditing(null); setShowForm(true); }} data-testid="admin-create-offer-button"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)]">
                    <Plus className="w-3.5 h-3.5" /> New Offer
                </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                    [...Array(4)].map((_, i) => <div key={i} className="rounded-2xl hg-bg-glass animate-pulse h-44" />)
                ) : items.length === 0 ? (
                    <div className="col-span-full p-10 text-center text-white/45">No offers</div>
                ) : items.map((offer) => (
                    <div key={offer.id} className="relative rounded-2xl hg-bg-glass-strong overflow-hidden group" data-testid="admin-offer-card">
                        <div className="relative aspect-[16/10]">
                            <img src={offer.banner_image} alt={offer.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                        </div>
                        <div className="p-4">
                            <div className="text-[10px] tracking-[0.22em] uppercase" style={{ color: offer.accent_color }}>{offer.subtitle}</div>
                            <div className="font-display text-base text-white tracking-wide mt-1">{offer.title}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <button onClick={() => { setEditing(offer); setShowForm(true); }} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/75 hover:text-[var(--hg-gold)]">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(offer)} className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/15 text-white/75 hover:text-red-400">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <span className="ml-auto text-[10px] tracking-[0.22em] uppercase text-white/55">{offer.active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <OfferFormDialog open={showForm} onClose={() => setShowForm(false)} editing={editing} onSaved={() => { setShowForm(false); load(); }} />
        </div>
    );
}

function OfferFormDialog({ open, onClose, editing, onSaved }) {
    const [form, setForm] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { setForm(editing || EMPTY); }, [editing, open]);

    const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) await adminUpdateOffer(editing.id, form);
            else await adminCreateOffer(form);
            toast.success(editing ? 'Updated' : 'Created');
            onSaved();
        } catch { toast.error('Failed to save'); }
        finally { setSubmitting(false); }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-xl bg-[#0B0F1A] border-[rgba(212,175,55,0.32)]">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl text-white tracking-wide">{editing ? 'Edit Offer' : 'New Offer'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Title *"><input required value={form.title} onChange={(e) => upd('title', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]" /></Field>
                    <Field label="Subtitle"><input value={form.subtitle} onChange={(e) => upd('subtitle', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]" /></Field>
                    <Field label="Description"><textarea value={form.description || ''} onChange={(e) => upd('description', e.target.value)} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)] resize-none" /></Field>
                    <Field label="Banner Image URL *"><input required value={form.banner_image} onChange={(e) => upd('banner_image', e.target.value)} placeholder="https://…" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)]" /></Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Accent Color"><input type="color" value={form.accent_color} onChange={(e) => upd('accent_color', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-2 py-1 h-10" /></Field>
                        <Field label="Link Target"><input value={form.link_target || ''} onChange={(e) => upd('link_target', e.target.value)} placeholder="#gemstones" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]" /></Field>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!form.active} onChange={(e) => upd('active', e.target.checked)} className="w-4 h-4 accent-[var(--hg-gold)]" />
                        <span className="text-xs tracking-[0.22em] uppercase text-white/75">Active</span>
                    </label>
                    <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-xs tracking-[0.22em] uppercase text-white/65 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-full text-xs tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] disabled:opacity-60">
                            {submitting ? 'Saving…' : (editing ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="block text-[10px] tracking-[0.26em] uppercase text-white/55 mb-1.5">{label}</span>
            {children}
        </label>
    );
}
