// HUANG GEMS — Node.js + Express + Mongoose backend
// Listens on PORT (default 8002). The FastAPI shim on 8001 proxies all /api/* requests here.
// To self-host: run `node index.js` after setting MONGO_URL, DB_NAME, JWT_SECRET, PORT in .env.

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
    Gemstone, Jewelry, Inquiry, Admin, Offer, Testimonial, Certification
} = require('./models');
const seedData = require('./seed');

const PORT = parseInt(process.env.NODE_PORT || '8002', 10);
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'test_database';
const JWT_SECRET = process.env.JWT_SECRET || 'huang-gems-secret-key-2025';
const JWT_EXPIRES = '7d';

const app = express();
app.use(cors({ origin: (process.env.CORS_ORIGINS || '*').split(','), credentials: true }));
app.use(express.json({ limit: '5mb' }));

// ============ MIDDLEWARE ============
async function requireAdmin(req, res, next) {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
        return res.status(401).json({ detail: 'Not authenticated' });
    }
    const token = auth.slice(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findOne({ email: payload.sub }).lean();
        if (!admin) return res.status(401).json({ detail: 'Admin not found' });
        delete admin.hashedPassword;
        delete admin.hashed_password;
        req.admin = admin;
        next();
    } catch (e) {
        return res.status(401).json({ detail: 'Invalid or expired token' });
    }
}

// Serialize Mongoose doc (strip _id, __v)
function serialize(doc) {
    if (!doc) return doc;
    if (Array.isArray(doc)) return doc.map(serialize);
    const o = doc.toObject ? doc.toObject() : doc;
    delete o._id;
    delete o.__v;
    delete o.hashed_password;
    delete o.hashedPassword;
    return o;
}

// ============ PUBLIC ROUTES ============
const api = express.Router();

api.get('/', (_req, res) => res.json({ name: 'HUANG GEMS API', version: '1.0.0', engine: 'Node.js + Express + Mongoose', status: 'online' }));

api.get('/gemstones', async (req, res) => {
    const q = {};
    const { type, gemstone_family, origin, rarity, certification, natural, price_tier, featured, min_carat, max_carat, search, limit } = req.query;
    if (type) q.type = type;
    if (gemstone_family) q.gemstone_family = gemstone_family;
    if (origin) q.origin = { $regex: origin, $options: 'i' };
    if (rarity) q.rarity = rarity;
    if (certification) q.certification = { $regex: certification, $options: 'i' };
    if (natural !== undefined) q.natural = natural === 'true';
    if (price_tier) q.price_tier = price_tier;
    if (featured !== undefined) q.featured = featured === 'true';
    if (min_carat || max_carat) {
        q.weight_carat = {};
        if (min_carat) q.weight_carat.$gte = parseFloat(min_carat);
        if (max_carat) q.weight_carat.$lte = parseFloat(max_carat);
    }
    if (search) {
        q.$or = [
            { name: { $regex: search, $options: 'i' } },
            { gemstone_family: { $regex: search, $options: 'i' } },
            { origin: { $regex: search, $options: 'i' } },
        ];
    }
    const docs = await Gemstone.find(q).sort({ created_at: -1 }).limit(parseInt(limit || '200', 10)).lean();
    res.json(docs.map(serialize));
});

api.get('/gemstones/:id', async (req, res) => {
    const doc = await Gemstone.findOne({ id: req.params.id }).lean();
    if (!doc) return res.status(404).json({ detail: 'Gemstone not found' });
    res.json(serialize(doc));
});

api.get('/jewelry', async (req, res) => {
    const q = {};
    const { category, metal_type, primary_gemstone, featured, limit } = req.query;
    if (category) q.category = category;
    if (metal_type) q.metal_type = { $regex: metal_type, $options: 'i' };
    if (primary_gemstone) q.primary_gemstone = { $regex: primary_gemstone, $options: 'i' };
    if (featured !== undefined) q.featured = featured === 'true';
    const docs = await Jewelry.find(q).sort({ created_at: -1 }).limit(parseInt(limit || '200', 10)).lean();
    res.json(docs.map(serialize));
});

api.get('/jewelry/:id', async (req, res) => {
    const doc = await Jewelry.findOne({ id: req.params.id }).lean();
    if (!doc) return res.status(404).json({ detail: 'Jewelry item not found' });
    res.json(serialize(doc));
});

api.post('/inquiries', async (req, res) => {
    const body = req.body || {};
    if (!body.name || !body.email || !body.message) {
        return res.status(400).json({ detail: 'name, email, message are required' });
    }
    const doc = await Inquiry.create({
        id: crypto.randomUUID(),
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        product_type: body.product_type || null,
        product_id: body.product_id || null,
        product_name: body.product_name || null,
        message: body.message,
        preferred_channel: body.preferred_channel || 'email',
        status: 'new',
        created_at: new Date(),
    });
    res.json({ success: true, message: 'Your inquiry has been received. Our concierge will contact you shortly.', id: doc.id });
});

api.get('/offers', async (req, res) => {
    const q = {};
    if (req.query.active !== undefined) q.active = req.query.active === 'true';
    else q.active = true;
    const docs = await Offer.find(q).lean();
    res.json(docs.map(serialize));
});

api.get('/testimonials', async (_req, res) => {
    const docs = await Testimonial.find({}).lean();
    res.json(docs.map(serialize));
});

api.get('/certifications', async (_req, res) => {
    const docs = await Certification.find({}).lean();
    res.json(docs.map(serialize));
});

api.get('/contact-info', (_req, res) => {
    res.json({
        brand: 'HUANG GEMS',
        tagline: 'Where Rarity Meets Eternity',
        whatsapp: '+8613800008888',
        whatsapp_display: '+86 138 0000 8888',
        wechat_id: 'HuangGemsVIP',
        instagram: 'huanggems',
        instagram_url: 'https://instagram.com/huanggems',
        email: 'contact@huanggems.com',
        address: 'Diamond Tower, Beijing · Hong Kong · Dubai',
        hours: 'By appointment only',
    });
});

// ============ ADMIN AUTH ============
api.post('/admin/login', async (req, res) => {
    const { email, password } = req.body || {};
    const admin = await Admin.findOne({ email }).lean();
    if (!admin || !bcrypt.compareSync(password || '', admin.hashed_password || '')) {
        return res.status(401).json({ detail: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: admin.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({
        access_token: token,
        token_type: 'bearer',
        admin: { email: admin.email, name: admin.name || 'Admin' },
    });
});

api.get('/admin/me', requireAdmin, (req, res) => res.json(req.admin));

api.get('/admin/stats', requireAdmin, async (_req, res) => {
    const [total_gemstones, total_jewelry, total_inquiries, pending_inquiries, contacted_inquiries, featured_count] = await Promise.all([
        Gemstone.countDocuments({}),
        Jewelry.countDocuments({}),
        Inquiry.countDocuments({}),
        Inquiry.countDocuments({ status: 'new' }),
        Inquiry.countDocuments({ status: 'contacted' }),
        Gemstone.countDocuments({ featured: true }),
    ]);
    res.json({ total_gemstones, total_jewelry, total_inquiries, pending_inquiries, contacted_inquiries, featured_count });
});

// ============ ADMIN CRUD: GEMSTONES ============
api.post('/admin/gemstones', requireAdmin, async (req, res) => {
    const body = { ...req.body, id: crypto.randomUUID(), created_at: new Date() };
    const doc = await Gemstone.create(body);
    res.json(serialize(doc.toObject()));
});
api.put('/admin/gemstones/:id', requireAdmin, async (req, res) => {
    const doc = await Gemstone.findOneAndUpdate({ id: req.params.id }, req.body, { new: true }).lean();
    if (!doc) return res.status(404).json({ detail: 'Gemstone not found' });
    res.json(serialize(doc));
});
api.delete('/admin/gemstones/:id', requireAdmin, async (req, res) => {
    const r = await Gemstone.deleteOne({ id: req.params.id });
    if (r.deletedCount === 0) return res.status(404).json({ detail: 'Gemstone not found' });
    res.json({ success: true });
});

// ============ ADMIN CRUD: JEWELRY ============
api.post('/admin/jewelry', requireAdmin, async (req, res) => {
    const body = { ...req.body, id: crypto.randomUUID(), created_at: new Date() };
    const doc = await Jewelry.create(body);
    res.json(serialize(doc.toObject()));
});
api.put('/admin/jewelry/:id', requireAdmin, async (req, res) => {
    const doc = await Jewelry.findOneAndUpdate({ id: req.params.id }, req.body, { new: true }).lean();
    if (!doc) return res.status(404).json({ detail: 'Jewelry not found' });
    res.json(serialize(doc));
});
api.delete('/admin/jewelry/:id', requireAdmin, async (req, res) => {
    const r = await Jewelry.deleteOne({ id: req.params.id });
    if (r.deletedCount === 0) return res.status(404).json({ detail: 'Jewelry not found' });
    res.json({ success: true });
});

// ============ ADMIN INQUIRIES ============
api.get('/admin/inquiries', requireAdmin, async (req, res) => {
    const q = req.query.status ? { status: req.query.status } : {};
    const docs = await Inquiry.find(q).sort({ created_at: -1 }).lean();
    res.json(docs.map(serialize));
});
api.patch('/admin/inquiries/:id', requireAdmin, async (req, res) => {
    const { status } = req.body || {};
    if (!['new', 'contacted', 'closed'].includes(status)) {
        return res.status(400).json({ detail: 'Invalid status' });
    }
    const doc = await Inquiry.findOneAndUpdate({ id: req.params.id }, { status }, { new: true }).lean();
    if (!doc) return res.status(404).json({ detail: 'Inquiry not found' });
    res.json(serialize(doc));
});
api.delete('/admin/inquiries/:id', requireAdmin, async (req, res) => {
    const r = await Inquiry.deleteOne({ id: req.params.id });
    if (r.deletedCount === 0) return res.status(404).json({ detail: 'Inquiry not found' });
    res.json({ success: true });
});

// ============ ADMIN OFFERS ============
api.post('/admin/offers', requireAdmin, async (req, res) => {
    const body = { ...req.body, id: crypto.randomUUID(), created_at: new Date() };
    const doc = await Offer.create(body);
    res.json(serialize(doc.toObject()));
});
api.put('/admin/offers/:id', requireAdmin, async (req, res) => {
    const doc = await Offer.findOneAndUpdate({ id: req.params.id }, req.body, { new: true }).lean();
    if (!doc) return res.status(404).json({ detail: 'Offer not found' });
    res.json(serialize(doc));
});
api.delete('/admin/offers/:id', requireAdmin, async (req, res) => {
    const r = await Offer.deleteOne({ id: req.params.id });
    if (r.deletedCount === 0) return res.status(404).json({ detail: 'Offer not found' });
    res.json({ success: true });
});

app.use('/api', api);

// Health check (for the FastAPI proxy)
app.get('/__node_health__', (_req, res) => res.json({ ok: true, port: PORT }));

// Boot
(async () => {
    if (!MONGO_URL) {
        console.error('[node-backend] MONGO_URL missing');
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGO_URL, { dbName: DB_NAME });
        console.log(`[node-backend] connected to MongoDB (db=${DB_NAME})`);
        await seedData();
        app.listen(PORT, '127.0.0.1', () => {
            console.log(`[node-backend] HUANG GEMS Express server listening on http://127.0.0.1:${PORT}`);
        });
    } catch (e) {
        console.error('[node-backend] startup error:', e.message);
        process.exit(1);
    }
})();

// Graceful shutdown
for (const sig of ['SIGTERM', 'SIGINT']) {
    process.on(sig, async () => {
        try { await mongoose.disconnect(); } catch (_) {}
        process.exit(0);
    });
}
