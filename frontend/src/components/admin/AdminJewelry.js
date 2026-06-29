import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Sparkles, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import {
    fetchJewelry,
    adminCreateJewelry,
    adminUpdateJewelry,
    adminDeleteJewelry,
} from '../../lib/api';
import { JEWELRY_CATEGORIES } from '../../lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const EMPTY = {
    name: '', category: 'rings', metal_type: '18K Yellow Gold', primary_gemstone: '',
    total_carat: 0, craftsmanship_notes: '', description: '', price_tier: 'Luxury',
    availability: 'Available on Inquiry', images: [''], featured: false,
};

export default function AdminJewelry() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const load = async () => {
        setLoading(true);
        try { setItems(await fetchJewelry()); }
        catch { toast.error('Failed to load jewelry'); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const filtered = items.filter((it) =>
        !query || it.name.toLowerCase().includes(query.toLowerCase()) ||
        (it.category || '').toLowerCase().includes(query.toLowerCase())
    );

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete "${item.name}"?`)) return;
        try { await adminDeleteJewelry(item.id); toast.success('Deleted'); load(); }
        catch { toast.error('Failed to delete'); }
    };

    return (
        <div data-testid="admin-jewelry-page">
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide font-semibold flex-1">Jewelry</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
                        className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)]" />
                </div>
                <button onClick={() => { setEditing(null); setShowForm(true); }} data-testid="admin-create-button"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)]">
                    <Plus className="w-3.5 h-3.5" /> New Jewelry
                </button>
            </div>

            <div className="rounded-2xl hg-bg-glass-strong overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]" data-testid="admin-data-table">
                    <thead>
                        <tr className="text-left text-[10px] tracking-[0.26em] uppercase text-white/45 border-b border-white/10">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Metal</th>
                            <th className="py-3 px-4">Carat</th>
                            <th className="py-3 px-4">Tier</th>
                            <th className="py-3 px-4">Featured</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="py-10 text-center text-white/45">Loading…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="py-10 text-center text-white/45">No jewelry items found</td></tr>
                        ) : filtered.map((item) => (
                            <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                                <td className="py-3 px-4 text-white">{item.name}</td>
                                <td className="py-3 px-4 text-white/75 capitalize">{(item.category || '').replace('_', ' ')}</td>
                                <td className="py-3 px-4 text-white/65">{item.metal_type}</td>
                                <td className="py-3 px-4 text-white/75">{item.total_carat || '—'}</td>
                                <td className="py-3 px-4 text-white/65">{item.price_tier}</td>
                                <td className="py-3 px-4">{item.featured ? <Sparkles className="w-4 h-4 text-[var(--hg-gold)]" /> : <span className="text-white/30">—</span>}</td>
                                <td className="py-3 px-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/75 hover:text-[var(--hg-gold)]" data-testid="admin-edit-button">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(item)} className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/15 text-white/75 hover:text-red-400" data-testid="admin-delete-button">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <JewelryFormDialog open={showForm} onClose={() => setShowForm(false)} editing={editing} onSaved={() => { setShowForm(false); load(); }} />
        </div>
    );
}

function JewelryFormDialog({ open, onClose, editing, onSaved }) {
    const [form, setForm] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editing) setForm({ ...editing, images: editing.images?.length ? editing.images : [''] });
        else setForm(EMPTY);
    }, [editing, open]);

    const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const updImg = (i, v) => { const a = [...form.images]; a[i] = v; setForm({ ...form, images: a }); };
    const addImg = () => setForm({ ...form, images: [...form.images, ''] });
    const rmImg = (i) => { const a = [...form.images]; a.splice(i, 1); setForm({ ...form, images: a.length ? a : [''] }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        
        try {
            const payload = { ...form, images: form.images.filter((u) => u.trim()) };
            console.log(payload);
            payload.total_carat = parseFloat(payload.total_carat) || 0;
            if (editing) await adminUpdateJewelry(editing.id, payload);
            else await adminCreateJewelry(payload);
            toast.success(editing ? 'Updated' : 'Created');
            onSaved();
        } catch (err) {
            toast.error(err?.response?.data?.detail || 'Failed to save');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B0F1A] border-[rgba(212,175,55,0.32)]">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl text-white tracking-wide">{editing ? 'Edit Jewelry' : 'New Jewelry'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Name *"><input required value={form.name} onChange={(e) => upd('name', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]" /></Field>
                        <Field label="Category">
                            <select value={form.category} onChange={(e) => upd('category', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]">
                                {JEWELRY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id} className="bg-black">{c.label}</option>)}
                            </select>
                        </Field>
                        <Field label="Metal Type"><input value={form.metal_type} onChange={(e) => upd('metal_type', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]" /></Field>
                        <Field label="Primary Gemstone"><input value={form.primary_gemstone || ''} onChange={(e) => upd('primary_gemstone', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]" /></Field>
                        <Field label="Total Carat"><input type="number" step="0.01" value={form.total_carat || 0} onChange={(e) => upd('total_carat', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]" /></Field>
                        <Field label="Price Tier">
                            <select value={form.price_tier} onChange={(e) => upd('price_tier', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]">
                                {['Premium', 'Luxury', 'Ultra-Luxury'].map((o) => <option key={o} value={o} className="bg-black">{o}</option>)}
                            </select>
                        </Field>
                    </div>
                    <Field label="Description"><textarea value={form.description || ''} onChange={(e) => upd('description', e.target.value)} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)] resize-none" /></Field>
                    <Field label="Craftsmanship Notes"><textarea value={form.craftsmanship_notes || ''} onChange={(e) => upd('craftsmanship_notes', e.target.value)} rows={2} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)] resize-none" /></Field>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] tracking-[0.26em] uppercase text-white/55">Image URLs</span>
                            <button type="button" onClick={addImg} className="text-[10px] tracking-[0.22em] uppercase text-[var(--hg-gold)]">+ Add</button>
                        </div>
                        <div className="space-y-2">
                            {form.images.map((url, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input value={url} onChange={(e) => updImg(idx, e.target.value)} placeholder="https://…" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)]" />
                                    {form.images.length > 1 && (
                                        <button type="button" onClick={() => rmImg(idx)} className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-red-500/15 text-white/65 hover:text-red-400"><X className="w-4 h-4" /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!form.featured} onChange={(e) => upd('featured', e.target.checked)} className="w-4 h-4 accent-[var(--hg-gold)]" />
                        <span className="text-xs tracking-[0.22em] uppercase text-white/75">Featured</span>
                    </label>
                    <div className="flex justify-end gap-2 pt-3 border-t border-white/10 mt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-xs tracking-[0.22em] uppercase text-white/65 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10">Cancel</button>
                        <button type="submit" disabled={submitting} data-testid="admin-save-button" className="px-5 py-2.5 rounded-full text-xs tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] disabled:opacity-60">
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
