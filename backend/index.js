// HUANG GEMS — Node.js + Express + Mongoose backend
// Vercel-compatible version

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
    Gemstone,
    Jewelry,
    Inquiry,
    Admin,
    Offer,
    Testimonial,
    Certification
} = require('./models');

// OPTIONAL
// const seedData = require('./seed');

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'test_database';
const JWT_SECRET = process.env.JWT_SECRET || 'huang-gems-secret-key-2025';
const JWT_EXPIRES = '7d';

const app = express();

// ================= CORS =================
app.use(cors({
    origin: [
        'http://localhost:3000',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));

app.options('*', cors());

app.use(express.json({ limit: '5mb' }));

// ================= DATABASE =================
let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    if (!MONGO_URL) {
        throw new Error('MONGO_URL is missing');
    }

    await mongoose.connect(MONGO_URL, {
        dbName: DB_NAME
    });

    isConnected = true;

    console.log(`[node-backend] connected to MongoDB (${DB_NAME})`);

    // OPTIONAL — RUN ONLY ONCE
    // await seedData();
}

// DB middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            detail: 'Database connection failed'
        });
    }
});

// ================= HELPERS =================

async function requireAdmin(req, res, next) {
    const auth = req.headers.authorization || '';

    if (!auth.startsWith('Bearer ')) {
        return res.status(401).json({
            detail: 'Not authenticated'
        });
    }

    const token = auth.slice(7);

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        const admin = await Admin.findOne({
            email: payload.sub
        }).lean();

        if (!admin) {
            return res.status(401).json({
                detail: 'Admin not found'
            });
        }

        delete admin.hashed_password;

        req.admin = admin;

        next();
    } catch (e) {
        return res.status(401).json({
            detail: 'Invalid or expired token'
        });
    }
}

function serialize(doc) {
    if (!doc) return doc;

    if (Array.isArray(doc)) {
        return doc.map(serialize);
    }

    const o = doc.toObject ? doc.toObject() : doc;

    delete o._id;
    delete o.__v;
    delete o.hashed_password;
    delete o.hashedPassword;

    return o;
}

// ================= ROUTES =================

const api = express.Router();

// HEALTH
api.get('/', (_req, res) => {
    res.json({
        name: 'HUANG GEMS API',
        version: '1.0.0',
        status: 'online'
    });
});

// ================= GEMSTONES =================

api.get('/gemstones', async (req, res) => {
    try {
        const q = {};

        const {
            type,
            gemstone_family,
            origin,
            rarity,
            certification,
            natural,
            price_tier,
            featured,
            min_carat,
            max_carat,
            search,
            limit
        } = req.query;

        if (type) q.type = type;

        if (gemstone_family) {
            q.gemstone_family = gemstone_family;
        }

        if (origin) {
            q.origin = {
                $regex: origin,
                $options: 'i'
            };
        }

        if (rarity) q.rarity = rarity;

        if (certification) {
            q.certification = {
                $regex: certification,
                $options: 'i'
            };
        }

        if (natural !== undefined) {
            q.natural = natural === 'true';
        }

        if (price_tier) q.price_tier = price_tier;

        if (featured !== undefined) {
            q.featured = featured === 'true';
        }

        if (min_carat || max_carat) {
            q.weight_carat = {};

            if (min_carat) {
                q.weight_carat.$gte = parseFloat(min_carat);
            }

            if (max_carat) {
                q.weight_carat.$lte = parseFloat(max_carat);
            }
        }

        if (search) {
            q.$or = [
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    gemstone_family: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    origin: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }

        const docs = await Gemstone.find(q)
            .sort({ created_at: -1 })
            .limit(parseInt(limit || '200'))
            .lean();

        res.json(docs.map(serialize));
    } catch (err) {
        console.error(err);

        res.status(500).json({
            detail: 'Failed to fetch gemstones'
        });
    }
});

api.get('/gemstones/:id', async (req, res) => {
    try {
        const doc = await Gemstone.findOne({
            id: req.params.id
        }).lean();

        if (!doc) {
            return res.status(404).json({
                detail: 'Gemstone not found'
            });
        }

        res.json(serialize(doc));
    } catch (err) {
        console.error(err);

        res.status(500).json({
            detail: 'Failed to fetch gemstone'
        });
    }
});

// ================= JEWELRY =================

api.get('/jewelry', async (req, res) => {
    try {
        const q = {};

        const {
            category,
            metal_type,
            primary_gemstone,
            featured,
            limit
        } = req.query;

        if (category) q.category = category;

        if (metal_type) {
            q.metal_type = {
                $regex: metal_type,
                $options: 'i'
            };
        }

        if (primary_gemstone) {
            q.primary_gemstone = {
                $regex: primary_gemstone,
                $options: 'i'
            };
        }

        if (featured !== undefined) {
            q.featured = featured === 'true';
        }

        const docs = await Jewelry.find(q)
            .sort({ created_at: -1 })
            .limit(parseInt(limit || '200'))
            .lean();

        res.json(docs.map(serialize));
    } catch (err) {
        console.error(err);

        res.status(500).json({
            detail: 'Failed to fetch jewelry'
        });
    }
});

// ================= TESTIMONIALS =================

api.get('/testimonials', async (_req, res) => {
    try {
        const docs = await Testimonial.find({}).lean();

        res.json(docs.map(serialize));
    } catch (err) {
        console.error(err);

        res.status(500).json({
            detail: 'Failed to fetch testimonials'
        });
    }
});

// ================= CERTIFICATIONS =================

api.get('/certifications', async (_req, res) => {
    try {
        const docs = await Certification.find({}).lean();

        res.json(docs.map(serialize));
    } catch (err) {
        console.error(err);

        res.status(500).json({
            detail: 'Failed to fetch certifications'
        });
    }
});

// ================= OFFERS =================

api.get('/offers', async (req, res) => {
    try {
        const q = {};

        if (req.query.active !== undefined) {
            q.active = req.query.active === 'true';
        } else {
            q.active = true;
        }

        const docs = await Offer.find(q).lean();

        res.json(docs.map(serialize));
    } catch (err) {
        console.error(err);

        res.status(500).json({
            detail: 'Failed to fetch offers'
        });
    }
});

// ================= CONTACT =================

api.get('/contact-info', (_req, res) => {
    res.json({
        brand: 'HUANG GEMS',
        tagline: 'Where Rarity Meets Eternity',
        whatsapp: '+8613800008888',
        email: 'contact@huanggems.com',
        instagram: 'huanggems'
    });
});

// ================= INQUIRIES =================

api.post('/inquiries', async (req, res) => {
    try {
        const body = req.body || {};

        if (!body.name || !body.email || !body.message) {
            return res.status(400).json({
                detail: 'name, email, message are required'
            });
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
            created_at: new Date()
        });

        res.json({
            success: true,
            id: doc.id
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            detail: 'Failed to create inquiry'
        });
    }
});

// ================= ADMIN LOGIN =================

api.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};

        const admin = await Admin.findOne({ email }).lean();

        if (
            !admin ||
            !bcrypt.compareSync(
                password || '',
                admin.hashed_password || ''
            )
        ) {
            return res.status(401).json({
                detail: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { sub: admin.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.json({
            access_token: token,
            token_type: 'bearer',
            admin: {
                email: admin.email,
                name: admin.name || 'Admin'
            }
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            detail: 'Login failed'
        });
    }
});

// ================= ADMIN ME =================

api.get('/admin/me', requireAdmin, (req, res) => {
    res.json(req.admin);
});

// ================= MOUNT =================

app.use('/api', api);

// ================= EXPORT =================

module.exports = app;