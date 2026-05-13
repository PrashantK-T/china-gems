// HUANG GEMS — Mongoose models
const mongoose = require('mongoose');
const { Schema } = mongoose;

const GemstoneSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    gemstone_family: String,
    type: String, // precious / semi-precious / organic
    origin: String,
    shape: String,
    cut: String,
    color: String,
    weight_carat: Number,
    clarity: String,
    transparency: String,
    treatment: String,
    certification: String,
    rarity: String,
    hardness: Number,
    investment_grade: { type: Boolean, default: false },
    natural: { type: Boolean, default: true },
    price_tier: String,
    availability: String,
    short_description: String,
    long_description: String,
    symbolism: String,
    spiritual_meaning: String,
    market_popularity: String,
    images: [String],
    featured: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
}, { collection: 'gemstones', strict: false });

const JewelrySchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: String,
    metal_type: String,
    primary_gemstone: String,
    total_carat: Number,
    craftsmanship_notes: String,
    description: String,
    price_tier: String,
    availability: String,
    images: [String],
    featured: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
}, { collection: 'jewelry', strict: false });

const InquirySchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: String,
    email: String,
    phone: String,
    product_type: String,
    product_id: String,
    product_name: String,
    message: String,
    preferred_channel: { type: String, default: 'email' },
    status: { type: String, default: 'new' },
    created_at: { type: Date, default: Date.now },
}, { collection: 'inquiries', strict: false });

const AdminSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    hashed_password: String,
    name: String,
    created_at: { type: Date, default: Date.now },
}, { collection: 'admins', strict: false });

const OfferSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    title: String,
    subtitle: String,
    description: String,
    banner_image: String,
    accent_color: { type: String, default: '#D4AF37' },
    link_target: String,
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
}, { collection: 'offers', strict: false });

const TestimonialSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    client_name: String,
    client_title: String,
    country: String,
    message: String,
    rating: { type: Number, default: 5 },
    image: String,
}, { collection: 'testimonials', strict: false });

const CertificationSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: String,
    full_name: String,
    description: String,
    logo_text: String,
}, { collection: 'certifications', strict: false });

module.exports = {
    Gemstone: mongoose.model('Gemstone', GemstoneSchema),
    Jewelry: mongoose.model('Jewelry', JewelrySchema),
    Inquiry: mongoose.model('Inquiry', InquirySchema),
    Admin: mongoose.model('Admin', AdminSchema),
    Offer: mongoose.model('Offer', OfferSchema),
    Testimonial: mongoose.model('Testimonial', TestimonialSchema),
    Certification: mongoose.model('Certification', CertificationSchema),
};
