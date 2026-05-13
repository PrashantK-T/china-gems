import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Sparkles, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import {
    fetchGemstones,
    adminCreateGemstone,
    adminUpdateGemstone,
    adminDeleteGemstone,
} from '../../lib/api';
import { GEM_FAMILIES } from '../../lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const EMPTY = {
    name: '', gemstone_family: 'Ruby', type: 'precious', origin: '', shape: 'Oval Cut',
    cut: 'Precision Cut', color: '', weight_carat: 1.0, clarity: 'VS', transparency: 'Transparent',
    treatment: 'Non-Heated', certification: 'GIA', rarity: 'Rare', hardness: 9.0,
    investment_grade: true, natural: true, price_tier: 'Luxury', availability: 'Available on Inquiry',
    short_description: '', long_description: '', symbolism: '', spiritual_meaning: '',
    market_popularity: 'High', images: [''], featured: false,
};

export default function AdminGemstones() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState(null); // null | item
    const [showForm, setShowForm] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchGemstones();
            setItems(data || []);
        } catch (e) {
            toast.error('Failed to load gemstones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = items.filter((it) =>
        !query || it.name.toLowerCase().includes(query.toLowerCase()) ||
        it.gemstone_family.toLowerCase().includes(query.toLowerCase())
    );

    const handleEdit = (item) => { setEditing(item); setShowForm(true); };
    const handleCreate = () => { setEditing(null); setShowForm(true); };

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
        try {
            await adminDeleteGemstone(item.id);
            toast.success('Gemstone deleted');
            load();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div data-testid="admin-gemstones-page">
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide font-semibold flex-1">Gemstones</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search…"
                        className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)]"
                    />
                </div>
                <button
                    onClick={handleCreate}
                    data-testid="admin-create-button"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-[0.22em] uppercase font-semibold bg-[var(--hg-gold)] text-black hover:bg-[var(--hg-gold-2)] transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" /> New Gemstone
                </button>
            </div>

            <div className="rounded-2xl hg-bg-glass-strong overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]" data-testid="admin-data-table">
                    <thead>
                        <tr className="text-left text-[10px] tracking-[0.26em] uppercase text-white/45 border-b border-white/10">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Family</th>
                            <th className="py-3 px-4">Origin</th>
                            <th className="py-3 px-4">Carat</th>
                            <th className="py-3 px-4">Rarity</th>
                            <th className="py-3 px-4">Cert</th>
                            <th className="py-3 px-4">Featured</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className="py-10 text-center text-white/45">Loading…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} className="py-10 text-center text-white/45">No gemstones found</td></tr>
                        ) : filtered.map((item) => (
                            <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                                <td className="py-3 px-4 text-white">{item.name}</td>
                                <td className="py-3 px-4 text-white/75">{item.gemstone_family}</td>
                                <td className="py-3 px-4 text-white/65">{item.origin}</td>
                                <td className="py-3 px-4 text-white/75">{item.weight_carat}ct</td>
                                <td className="py-3 px-4 text-white/65">{item.rarity}</td>
                                <td className="py-3 px-4 text-white/65">{item.certification}</td>
                                <td className="py-3 px-4">{item.featured ? <Sparkles className="w-4 h-4 text-[var(--hg-gold)]" /> : <span className="text-white/30">—</span>}</td>
                                <td className="py-3 px-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/75 hover:text-[var(--hg-gold)]" data-testid="admin-edit-button">
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

            <GemstoneFormDialog
                open={showForm}
                onClose={() => setShowForm(false)}
                editing={editing}
                onSaved={() => { setShowForm(false); load(); }}
            />
        </div>
    );
}

function GemstoneFormDialog({ open, onClose, editing, onSaved }) {
    const [form, setForm] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editing) {
            setForm({ ...editing, images: editing.images?.length ? editing.images : [''] });
        } else {
            setForm(EMPTY);
        }
    }, [editing, open]);

    const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
    const updateImage = (idx, value) => {
        const arr = [...form.images]; arr[idx] = value; setForm({ ...form, images: arr });
    };
    const addImage = () => setForm({ ...form, images: [...form.images, ''] });
    const removeImage = (idx) => {
        const arr = [...form.images]; arr.splice(idx, 1);
        setForm({ ...form, images: arr.length ? arr : [''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...form, images: form.images.filter((u) => u.trim()) };
            // Coerce numeric fields
            payload.weight_carat = parseFloat(payload.weight_carat) || 0;
            payload.hardness = payload.hardness ? parseFloat(payload.hardness) : null;
            if (editing) {
                await adminUpdateGemstone(editing.id, payload);
                toast.success('Gemstone updated');
            } else {
                await adminCreateGemstone(payload);
                toast.success('Gemstone created');
            }
            onSaved();
        } catch (err) {
            toast.error(err?.response?.data?.detail || 'Failed to save');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0B0F1A] border-[rgba(212,175,55,0.32)]">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl text-white tracking-wide">
                        {editing ? 'Edit Gemstone' : 'New Gemstone'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Name *"><Input value={form.name} onChange={(v) => updateField('name', v)} required /></Field>
                        <Field label="Family">
                            <Select value={form.gemstone_family} onChange={(v) => updateField('gemstone_family', v)} options={GEM_FAMILIES} />
                        </Field>
                        <Field label="Type">
                            <Select value={form.type} onChange={(v) => updateField('type', v)} options={['precious', 'semi-precious', 'organic']} />
                        </Field>
                        <Field label="Origin"><Input value={form.origin} onChange={(v) => updateField('origin', v)} /></Field>
                        <Field label="Shape"><Input value={form.shape} onChange={(v) => updateField('shape', v)} /></Field>
                        <Field label="Cut"><Input value={form.cut} onChange={(v) => updateField('cut', v)} /></Field>
                        <Field label="Color"><Input value={form.color} onChange={(v) => updateField('color', v)} /></Field>
                        <Field label="Weight (ct)"><Input type="number" step="0.01" value={form.weight_carat} onChange={(v) => updateField('weight_carat', v)} /></Field>
                        <Field label="Clarity"><Input value={form.clarity || ''} onChange={(v) => updateField('clarity', v)} /></Field>
                        <Field label="Transparency"><Input value={form.transparency || ''} onChange={(v) => updateField('transparency', v)} /></Field>
                        <Field label="Treatment"><Input value={form.treatment || ''} onChange={(v) => updateField('treatment', v)} /></Field>
                        <Field label="Certification"><Input value={form.certification || ''} onChange={(v) => updateField('certification', v)} /></Field>
                        <Field label="Rarity">
                            <Select value={form.rarity} onChange={(v) => updateField('rarity', v)} options={['Common', 'Rare', 'Very Rare', 'Extremely Rare']} />
                        </Field>
                        <Field label="Hardness (Mohs)"><Input type="number" step="0.1" value={form.hardness ?? ''} onChange={(v) => updateField('hardness', v)} /></Field>
                        <Field label="Price Tier">
                            <Select value={form.price_tier} onChange={(v) => updateField('price_tier', v)} options={['Premium', 'Luxury', 'Ultra-Luxury']} />
                        </Field>
                        <Field label="Availability"><Input value={form.availability} onChange={(v) => updateField('availability', v)} /></Field>
                    </div>
                    <Field label="Short Description"><Textarea value={form.short_description || ''} onChange={(v) => updateField('short_description', v)} rows={2} /></Field>
                    <Field label="Long Description"><Textarea value={form.long_description || ''} onChange={(v) => updateField('long_description', v)} rows={3} /></Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Symbolism"><Input value={form.symbolism || ''} onChange={(v) => updateField('symbolism', v)} /></Field>
                        <Field label="Spiritual Meaning"><Input value={form.spiritual_meaning || ''} onChange={(v) => updateField('spiritual_meaning', v)} /></Field>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] tracking-[0.26em] uppercase text-white/55">Image URLs</span>
                            <button type="button" onClick={addImage} className="text-[10px] tracking-[0.22em] uppercase text-[var(--hg-gold)] hover:underline">+ Add</button>
                        </div>
                        <div className="space-y-2">
                            {form.images.map((url, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input value={url} onChange={(e) => updateImage(idx, e.target.value)} placeholder="https://…" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)]" />
                                    {form.images.length > 1 && (
                                        <button type="button" onClick={() => removeImage(idx)} className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-red-500/15 text-white/65 hover:text-red-400"><X className="w-4 h-4" /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-5 pt-2">
                        <Checkbox label="Natural" value={form.natural} onChange={(v) => updateField('natural', v)} />
                        <Checkbox label="Investment Grade" value={form.investment_grade} onChange={(v) => updateField('investment_grade', v)} />
                        <Checkbox label="Featured" value={form.featured} onChange={(v) => updateField('featured', v)} testid="admin-form-featured" />
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-white/10 mt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-xs tracking-[0.22em] uppercase text-white/65 hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/10">Cancel</button>
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
function Input({ value, onChange, type = 'text', required, ...rest }) {
    return (
        <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} required={required}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)] transition-colors" {...rest} />
    );
}
function Textarea({ value, onChange, rows = 3 }) {
    return (
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={rows}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--hg-gold)] transition-colors resize-none" />
    );
}
function Select({ value, onChange, options }) {
    return (
        <select value={value || ''} onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--hg-gold)]">
            {options.map((opt) => <option key={opt} value={opt} className="bg-black">{opt}</option>)}
        </select>
    );
}
function Checkbox({ label, value, onChange, testid }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer" data-testid={testid}>
            <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-[var(--hg-gold)]" />
            <span className="text-xs tracking-[0.22em] uppercase text-white/75">{label}</span>
        </label>
    );
}
