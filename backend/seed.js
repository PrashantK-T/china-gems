// HUANG GEMS — seed data (idempotent). Curated reliable image URLs.
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
    Gemstone, Jewelry, Inquiry, Admin, Offer, Testimonial, Certification
} = require('./models');

const USER = {
    rough_ruby: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/i0mmhhdv_gem-2.jpeg',
    cut_ruby: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/ogq516g6_gem-4.jpeg',
    sapphire_ring: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/rzwgbhzu_gem-5.jpeg',
    sapphire_necklace: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/j1ujg5bv_jwel-1.jpeg',
    bridal_set: 'https://customer-assets.emergentagent.com/job_faf4d25f-1013-485c-82bc-56445b7526ad/artifacts/4zks23bn_jwel-2.jpeg',
};

// Verified working luxury imagery — Pexels (public, no auth, stable CDN)
const IMG = {
    diamond_a: 'https://images.pexels.com/photos/68740/diamond-gem-cubic-zirconia-jewel-68740.jpeg?auto=compress&cs=tinysrgb&w=1200',
    diamond_b: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200',
    diamond_c: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=1200',
    diamond_ring: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ruby_a: 'https://images.pexels.com/photos/5370703/pexels-photo-5370703.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ruby_b: 'https://images.pexels.com/photos/5370797/pexels-photo-5370797.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sapphire_a: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sapphire_b: 'https://images.pexels.com/photos/12932100/pexels-photo-12932100.jpeg?auto=compress&cs=tinysrgb&w=1200',
    emerald_a: 'https://images.pexels.com/photos/9428803/pexels-photo-9428803.jpeg?auto=compress&cs=tinysrgb&w=1200',
    emerald_b: 'https://images.pexels.com/photos/7956842/pexels-photo-7956842.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pearl_a: 'https://images.pexels.com/photos/691052/pexels-photo-691052.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pearl_b: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200',
    opal: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200',
    jade: 'https://images.pexels.com/photos/13815049/pexels-photo-13815049.jpeg?auto=compress&cs=tinysrgb&w=1200',
    amethyst: 'https://images.pexels.com/photos/4937450/pexels-photo-4937450.jpeg?auto=compress&cs=tinysrgb&w=1200',
    topaz: 'https://images.pexels.com/photos/9428832/pexels-photo-9428832.jpeg?auto=compress&cs=tinysrgb&w=1200',
    aquamarine: 'https://images.pexels.com/photos/691043/pexels-photo-691043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tanzanite: 'https://images.pexels.com/photos/691045/pexels-photo-691045.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourmaline: 'https://images.pexels.com/photos/12932134/pexels-photo-12932134.jpeg?auto=compress&cs=tinysrgb&w=1200',
    citrine: 'https://images.pexels.com/photos/9428820/pexels-photo-9428820.jpeg?auto=compress&cs=tinysrgb&w=1200',
    garnet: 'https://images.pexels.com/photos/5370706/pexels-photo-5370706.jpeg?auto=compress&cs=tinysrgb&w=1200',
    spinel: 'https://images.pexels.com/photos/5370701/pexels-photo-5370701.jpeg?auto=compress&cs=tinysrgb&w=1200',
    peridot: 'https://images.pexels.com/photos/7956841/pexels-photo-7956841.jpeg?auto=compress&cs=tinysrgb&w=1200',
    moonstone: 'https://images.pexels.com/photos/691055/pexels-photo-691055.jpeg?auto=compress&cs=tinysrgb&w=1200',
    turquoise: 'https://images.pexels.com/photos/691044/pexels-photo-691044.jpeg?auto=compress&cs=tinysrgb&w=1200',
    morganite: 'https://images.pexels.com/photos/12932092/pexels-photo-12932092.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alexandrite: 'https://images.pexels.com/photos/9428838/pexels-photo-9428838.jpeg?auto=compress&cs=tinysrgb&w=1200',
    amber: 'https://images.pexels.com/photos/68740/diamond-gem-cubic-zirconia-jewel-68740.jpeg?auto=compress&cs=tinysrgb&w=1200',
    coral: 'https://images.pexels.com/photos/5370706/pexels-photo-5370706.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lapis: 'https://images.pexels.com/photos/12932100/pexels-photo-12932100.jpeg?auto=compress&cs=tinysrgb&w=1200',
    zircon: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=1200',
    necklace_a: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200',
    necklace_b: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ring_a: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ring_b: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1200',
    earring_a: 'https://images.pexels.com/photos/691043/pexels-photo-691043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    earring_b: 'https://images.pexels.com/photos/9428803/pexels-photo-9428803.jpeg?auto=compress&cs=tinysrgb&w=1200',
    bracelet_a: 'https://images.pexels.com/photos/12932134/pexels-photo-12932134.jpeg?auto=compress&cs=tinysrgb&w=1200',
    bracelet_b: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200',
    pendant_a: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200',
    offer_ruby: 'https://images.pexels.com/photos/5370797/pexels-photo-5370797.jpeg?auto=compress&cs=tinysrgb&w=1600',
    offer_sapphire: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=1600',
    offer_emerald: 'https://images.pexels.com/photos/9428803/pexels-photo-9428803.jpeg?auto=compress&cs=tinysrgb&w=1600',
    offer_bridal: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

function gem(o) {
    return {
        id: crypto.randomUUID(),
        name: o.name,
        gemstone_family: o.family,
        type: o.type,
        origin: o.origin,
        shape: o.shape || 'Oval Cut',
        cut: o.cut || 'Precision Cut',
        color: o.color,
        weight_carat: o.carat,
        clarity: o.clarity || 'VS',
        transparency: o.transparency || 'Transparent',
        treatment: o.treatment || 'Non-Heated',
        certification: o.cert || 'GIA',
        rarity: o.rarity,
        hardness: o.hardness,
        investment_grade: o.investment !== false,
        natural: o.natural !== false,
        price_tier: o.tier || 'Luxury',
        availability: 'Available on Inquiry',
        short_description: o.short || '',
        long_description: o.long || o.short || '',
        symbolism: o.symbolism || '',
        spiritual_meaning: o.spiritual || '',
        market_popularity: o.popularity || 'High',
        images: o.images,
        featured: !!o.featured,
        created_at: new Date(),
    };
}

function jw(o) {
    return {
        id: crypto.randomUUID(),
        name: o.name,
        category: o.category,
        metal_type: o.metal,
        primary_gemstone: o.gem,
        total_carat: o.carat,
        craftsmanship_notes: o.craft || 'Handcrafted by master artisans in our atelier with 200+ hours of meticulous setting work.',
        description: o.desc,
        price_tier: o.tier || 'Luxury',
        availability: 'Available on Inquiry',
        images: o.images,
        featured: !!o.featured,
        created_at: new Date(),
    };
}

const GEMSTONES = [
    gem({ name: 'Mozambique Pigeon Blood Ruby', family: 'Ruby', type: 'precious', origin: 'Mozambique, Africa', shape: 'Oval Cut', color: 'Deep Pigeon Blood Red', carat: 3.05, rarity: 'Extremely Rare', hardness: 9.0, cert: 'GIA', short: 'A rare non-heated Mozambique ruby with exceptional saturation and brilliance.', long: 'This 3.05 carat Mozambique ruby is a true collector\'s stone. Its untreated, non-heated nature combined with the legendary pigeon blood color makes it one of the most coveted gemstones in the world.', symbolism: 'Passion · Power · Royalty · Vitality', spiritual: 'Activates the heart chakra; symbol of love and courage.', tier: 'Ultra-Luxury', featured: true, images: [USER.cut_ruby, USER.rough_ruby, IMG.ruby_a] }),
    gem({ name: 'Burmese Rough Ruby Crystal', family: 'Ruby', type: 'precious', origin: 'Mogok, Myanmar', shape: 'Natural Crystal', cut: 'Uncut Specimen', color: 'Vivid Red', carat: 18.7, rarity: 'Very Rare', hardness: 9.0, treatment: 'Untreated', cert: 'SSEF', clarity: 'Natural Inclusions', short: 'Museum-grade natural ruby crystal from the legendary Mogok mines of Burma.', long: 'An exceptional 18.7 carat rough ruby crystal preserved in its natural state. The Mogok Valley has produced the world\'s finest rubies for over 600 years.', symbolism: 'Sovereignty · Protection · Life Force', tier: 'Ultra-Luxury', featured: true, images: [USER.rough_ruby, IMG.ruby_b] }),
    gem({ name: 'Ceylon Royal Blue Sapphire Ring', family: 'Sapphire', type: 'precious', origin: 'Sri Lanka (Ceylon)', shape: 'Oval Halo Setting', color: 'Royal Blue', carat: 2.15, rarity: 'Rare', hardness: 9.0, treatment: 'Heated', cert: 'GIA · Gübelin', short: 'Ceylon royal blue sapphire ring with diamond double halo in platinum.', symbolism: 'Wisdom · Truth · Royalty', tier: 'Ultra-Luxury', featured: true, images: [USER.sapphire_ring, IMG.sapphire_a, IMG.sapphire_b] }),
    gem({ name: 'Kashmir Sapphire — Cornflower Blue', family: 'Sapphire', type: 'precious', origin: 'Kashmir, India', shape: 'Cushion Cut', color: 'Cornflower Blue', carat: 4.32, rarity: 'Extremely Rare', hardness: 9.0, treatment: 'Non-Heated', cert: 'Gübelin · SSEF', short: 'The holy grail of sapphires — velvety cornflower blue from the mythical Kashmir mines.', long: 'Kashmir sapphires from the original deposits (last actively mined in the 1880s) are the most coveted blue gemstones on earth.', symbolism: 'Eternal Devotion · Celestial Power', tier: 'Ultra-Luxury', featured: true, images: [IMG.sapphire_a, IMG.sapphire_b] }),
    gem({ name: 'Colombian Muzo Emerald', family: 'Emerald', type: 'precious', origin: 'Muzo, Colombia', shape: 'Emerald Cut', color: 'Vivid Green', carat: 5.18, rarity: 'Very Rare', hardness: 7.75, treatment: 'Minor Oil', cert: 'GRS · Gübelin', short: 'Vivid garden-green Muzo emerald with exceptional crystal clarity.', long: 'Colombian emeralds from the Muzo mine display the legendary \'jardin\' inclusions — proof of natural origin — alongside an unmatched saturation of pure green.', symbolism: 'Rebirth · Fertility · Prosperity', tier: 'Ultra-Luxury', featured: true, images: [IMG.emerald_a, IMG.emerald_b] }),
    gem({ name: 'Type IIa D-Color Diamond', family: 'Diamond', type: 'precious', origin: 'Botswana', shape: 'Round Brilliant', color: 'Colorless (D)', carat: 3.50, rarity: 'Extremely Rare', hardness: 10.0, treatment: 'None', cert: 'GIA', clarity: 'IF', short: 'Investment-grade Type IIa D-color round brilliant diamond — chemically pure.', long: 'Type IIa diamonds represent less than 2% of all natural diamonds. D-color, internally flawless, with triple-excellent cut grade. The pinnacle of diamond rarity.', symbolism: 'Eternity · Strength · Perfection', tier: 'Ultra-Luxury', images: [IMG.diamond_a, IMG.diamond_b, IMG.diamond_c] }),
    gem({ name: 'Paraiba Tourmaline — Neon Blue', family: 'Tourmaline', type: 'semi-precious', origin: 'Paraíba, Brazil', shape: 'Oval Cut', color: 'Electric Neon Blue', carat: 2.85, rarity: 'Extremely Rare', hardness: 7.5, treatment: 'None', cert: 'GRS', short: 'Electric neon blue Paraiba tourmaline — rarer than diamond.', long: 'Paraiba tourmaline from the original Brazilian mines fetches higher prices per carat than diamond.', symbolism: 'Vitality · Tropical Energy', tier: 'Ultra-Luxury', images: [IMG.tourmaline] }),
    gem({ name: 'Tanzanite — AAA Vivid Violet-Blue', family: 'Tanzanite', type: 'semi-precious', origin: 'Merelani Hills, Tanzania', shape: 'Trillion Cut', color: 'Vivid Violet-Blue', carat: 6.20, rarity: 'Very Rare', hardness: 6.75, treatment: 'Heated', cert: 'GIA', short: 'Top-grade tanzanite — found only in a single 8km² zone on Earth.', symbolism: 'Transformation · Higher Consciousness', tier: 'Luxury', images: [IMG.tanzanite] }),
    gem({ name: 'Imperial Topaz — Sherry Pink', family: 'Topaz', type: 'semi-precious', origin: 'Ouro Preto, Brazil', shape: 'Pear Cut', color: 'Sherry Pink-Orange', carat: 8.45, rarity: 'Rare', hardness: 8.0, treatment: 'None', cert: 'GIA', short: 'Highly coveted Imperial topaz with golden-pink hue.', symbolism: 'Abundance · Manifestation', tier: 'Luxury', images: [IMG.topaz] }),
    gem({ name: 'Santa Maria Aquamarine', family: 'Aquamarine', type: 'semi-precious', origin: 'Santa Maria de Itabira, Brazil', shape: 'Octagon Cut', color: 'Deep Ocean Blue', carat: 12.30, rarity: 'Rare', hardness: 7.75, treatment: 'None', cert: 'GIA', short: 'Deeply saturated Santa Maria aquamarine — the most coveted variety.', symbolism: 'Serenity · Courage · Communication', tier: 'Luxury', images: [IMG.aquamarine] }),
    gem({ name: 'Royal Amethyst Cluster', family: 'Amethyst', type: 'semi-precious', origin: 'Uruguay', shape: 'Cushion Cut', color: 'Royal Purple', carat: 15.80, rarity: 'Common', hardness: 7.0, treatment: 'None', cert: 'In-House', short: 'Deep royal purple amethyst from premium Uruguayan deposits.', symbolism: 'Spiritual Protection · Clarity', tier: 'Premium', investment: false, images: [IMG.amethyst] }),
    gem({ name: 'Madeira Citrine', family: 'Citrine', type: 'semi-precious', origin: 'Brazil', shape: 'Emerald Cut', color: 'Deep Madeira Wine', carat: 10.50, rarity: 'Common', hardness: 7.0, treatment: 'Heated', cert: 'In-House', short: 'Premium Madeira citrine with rich port wine saturation.', symbolism: 'Success · Prosperity · Joy', tier: 'Premium', investment: false, images: [IMG.citrine] }),
    gem({ name: 'Mozambique Garnet — Mandarin', family: 'Garnet', type: 'semi-precious', origin: 'Mozambique', shape: 'Round Cut', color: 'Mandarin Orange', carat: 4.10, rarity: 'Rare', hardness: 7.0, treatment: 'None', cert: 'GIA', short: 'Vivid mandarin spessartite garnet with exceptional brilliance.', symbolism: 'Vitality · Creativity', tier: 'Luxury', images: [IMG.garnet] }),
    gem({ name: 'Mahenge Spinel — Hot Pink', family: 'Spinel', type: 'semi-precious', origin: 'Mahenge, Tanzania', shape: 'Cushion Cut', color: 'Hot Pink', carat: 3.25, rarity: 'Very Rare', hardness: 8.0, treatment: 'None', cert: 'GRS', short: 'Electric pink Mahenge spinel — among the rarest of spinels.', symbolism: 'Renewal · Energy', tier: 'Ultra-Luxury', images: [IMG.spinel] }),
    gem({ name: 'Burmese Peridot', family: 'Peridot', type: 'semi-precious', origin: 'Mogok, Myanmar', shape: 'Pear Cut', color: 'Apple Green', carat: 7.80, rarity: 'Common', hardness: 6.5, treatment: 'None', cert: 'In-House', short: 'Vibrant apple-green peridot from the storied Mogok region.', symbolism: 'Light · Renewal', tier: 'Premium', investment: false, images: [IMG.peridot] }),
    gem({ name: 'Australian Black Opal', family: 'Opal', type: 'semi-precious', origin: 'Lightning Ridge, Australia', shape: 'Freeform Cabochon', cut: 'Cabochon', color: 'Black with Rainbow Fire', carat: 5.60, rarity: 'Very Rare', hardness: 6.0, treatment: 'None', cert: 'GIA', transparency: 'Opaque', short: 'Lightning Ridge black opal with full-spectrum rainbow play-of-color.', long: 'Black opals are the rarest and most valuable opals.', symbolism: 'Mystery · Cosmic Energy', tier: 'Ultra-Luxury', images: [IMG.opal] }),
    gem({ name: 'Rainbow Moonstone', family: 'Moonstone', type: 'semi-precious', origin: 'India', shape: 'Oval Cabochon', cut: 'Cabochon', color: 'White with Blue Adularescence', carat: 9.40, rarity: 'Common', hardness: 6.0, treatment: 'None', cert: 'In-House', transparency: 'Translucent', short: 'Mystical rainbow moonstone with vibrant blue sheen.', symbolism: 'Feminine Energy · Intuition', tier: 'Premium', investment: false, images: [IMG.moonstone] }),
    gem({ name: 'Imperial Jadeite — Glass Type A', family: 'Jade', type: 'semi-precious', origin: 'Hpakant, Myanmar', shape: 'Cabochon', cut: 'Cabochon', color: 'Imperial Green', carat: 11.20, rarity: 'Extremely Rare', hardness: 7.0, treatment: 'None (Type A)', cert: 'HKJSL', transparency: 'Translucent', short: 'Imperial-grade Type A jadeite — translucent vivid green of the highest order.', long: 'Imperial jadeite is the most prized variety of jade in the world, historically reserved for Chinese emperors.', symbolism: 'Longevity · Harmony · Imperial Power', tier: 'Ultra-Luxury', images: [IMG.jade] }),
    gem({ name: 'Persian Turquoise', family: 'Turquoise', type: 'semi-precious', origin: 'Nishapur, Iran', shape: 'Oval Cabochon', cut: 'Cabochon', color: "Robin's Egg Blue", carat: 8.10, rarity: 'Rare', hardness: 6.0, treatment: 'None', cert: 'In-House', transparency: 'Opaque', short: 'Authentic Persian turquoise — the gold standard for over 2000 years.', symbolism: 'Protection · Sky Wisdom', tier: 'Luxury', images: [IMG.turquoise] }),
    gem({ name: 'Pink Morganite', family: 'Morganite', type: 'semi-precious', origin: 'Madagascar', shape: 'Cushion Cut', color: 'Soft Peach Pink', carat: 9.65, rarity: 'Common', hardness: 7.75, treatment: 'Heated', cert: 'In-House', short: 'Romantic peach-pink morganite — perfect for bespoke engagement settings.', symbolism: 'Divine Love · Compassion', tier: 'Premium', investment: false, images: [IMG.morganite] }),
    gem({ name: 'Russian Alexandrite — Color Change', family: 'Alexandrite', type: 'semi-precious', origin: 'Ural Mountains, Russia', shape: 'Oval Cut', color: 'Green to Purple-Red', carat: 1.85, rarity: 'Extremely Rare', hardness: 8.5, treatment: 'None', cert: 'GIA', short: 'True Russian alexandrite — emerald by day, ruby by night.', long: 'Alexandrite from the original Ural deposits is among the rarest gems on earth.', symbolism: 'Duality · Transformation', tier: 'Ultra-Luxury', images: [IMG.alexandrite] }),
    gem({ name: 'Cambodian Blue Zircon', family: 'Zircon', type: 'semi-precious', origin: 'Ratanakiri, Cambodia', shape: 'Round Brilliant', color: 'Electric Blue', carat: 6.50, rarity: 'Common', hardness: 7.5, treatment: 'Heated', cert: 'In-House', short: 'Brilliant electric blue zircon with diamond-like dispersion.', symbolism: 'Wisdom · Honor', tier: 'Premium', investment: false, images: [IMG.zircon] }),
    gem({ name: 'Afghan Lapis Lazuli — Royal Blue', family: 'Lapis Lazuli', type: 'semi-precious', origin: 'Sar-e-Sang, Afghanistan', shape: 'Oval Cabochon', cut: 'Cabochon', color: 'Royal Blue with Gold Pyrite', carat: 14.30, rarity: 'Rare', hardness: 5.5, treatment: 'None', cert: 'In-House', transparency: 'Opaque', short: 'Premium Afghan lapis lazuli — mined for over 6000 years.', symbolism: 'Truth · Royalty · Wisdom', tier: 'Luxury', images: [IMG.lapis] }),
    gem({ name: 'South Sea Golden Pearl', family: 'Pearl', type: 'organic', origin: 'Philippines', shape: 'Spherical', cut: 'Natural', color: 'Deep Golden', carat: 16.00, rarity: 'Very Rare', hardness: 3.5, treatment: 'None', cert: 'GIA', clarity: 'AAA Luster', transparency: 'Opaque', short: 'Rare South Sea golden pearl with luminous deep gold luster.', long: 'Golden South Sea pearls are produced only by the gold-lipped Pinctada maxima oyster. Each pearl takes 5-7 years to form.', symbolism: 'Purity · Wisdom · Femininity', tier: 'Luxury', images: [IMG.pearl_a, IMG.pearl_b] }),
    gem({ name: 'Baltic Amber with Inclusion', family: 'Amber', type: 'organic', origin: 'Baltic Coast', shape: 'Oval', cut: 'Polished', color: 'Cognac', carat: 22.50, rarity: 'Common', hardness: 2.5, treatment: 'None', cert: 'In-House', transparency: 'Translucent', short: 'Authentic Baltic amber with ancient natural inclusion — 40 million years old.', symbolism: 'Ancient Wisdom · Healing', tier: 'Premium', investment: false, images: [IMG.amber] }),
    gem({ name: 'Mediterranean Red Coral', family: 'Coral', type: 'organic', origin: 'Sardinia, Italy', shape: 'Branch', cut: 'Natural', color: 'Deep Red (Sang de Boeuf)', carat: 18.00, rarity: 'Rare', hardness: 3.5, treatment: 'None', cert: 'In-House', transparency: 'Opaque', short: 'Authentic Mediterranean oxblood coral — sustainably sourced.', symbolism: 'Life Force · Protection', tier: 'Luxury', images: [IMG.coral] }),
];

const JEWELRY = [
    jw({ name: 'Imperial Sapphire & Diamond Serpentine Necklace', category: 'necklaces', metal: '18K White Gold & Platinum', gem: 'Blue Sapphire & Diamond', carat: 84.5, desc: 'A breathtaking serpentine necklace combining ombre blue sapphires (graduating from royal blue to pale sky) with a cascade of pavé-set white diamonds, terminating in a 12-carat pear-cut D-flawless diamond drop.', craft: 'Over 850 hours of master craftsmanship. Each of 2,400+ stones individually hand-set.', tier: 'Ultra-Luxury', featured: true, images: [USER.sapphire_necklace, IMG.necklace_a] }),
    jw({ name: 'Royal Bridal Suite — Diamond Cascade', category: 'bridal_sets', metal: '18K Yellow Gold with Rhodium Accents', gem: 'Diamond', carat: 12.8, desc: 'A regal bridal suite featuring an intricate filigree necklace with diamond pavé, matching chandelier earrings, and a statement ring. Inspired by Imperial Chinese ceremonial jewelry.', craft: 'Hand-woven gold filigree by third-generation master artisans.', tier: 'Luxury', featured: true, images: [USER.bridal_set, IMG.ring_b] }),
    jw({ name: 'Ceylon Sapphire Double Halo Engagement Ring', category: 'rings', metal: 'Platinum 950', gem: 'Ceylon Blue Sapphire', carat: 3.85, desc: 'A 2.15ct Ceylon royal blue sapphire surrounded by a double halo of F-color VS diamonds, set in hand-finished platinum.', tier: 'Luxury', featured: true, images: [USER.sapphire_ring, IMG.ring_a] }),
    jw({ name: 'Heritage Solitaire — 5ct D-Flawless', category: 'rings', metal: 'Platinum 950', gem: 'Diamond', carat: 5.02, desc: 'A 5.02-carat round brilliant D-flawless Type IIa diamond solitaire, GIA-certified, set in a six-prong platinum mounting.', tier: 'Ultra-Luxury', images: [IMG.diamond_ring, IMG.diamond_a, IMG.diamond_b] }),
    jw({ name: 'Muzo Emerald Cocktail Ring', category: 'rings', metal: '18K Yellow Gold', gem: 'Colombian Emerald', carat: 8.20, desc: 'A 5.18ct Colombian Muzo emerald flanked by trapezoid diamonds on a classic cocktail mount.', tier: 'Ultra-Luxury', images: [IMG.emerald_a, IMG.ring_a] }),
    jw({ name: 'Pigeon Blood Ruby Statement Pendant', category: 'pendants', metal: 'Platinum 950', gem: 'Mozambique Ruby', carat: 4.50, desc: 'A 3-carat Mozambique pigeon blood ruby pendant with diamond halo on an 18" platinum chain.', tier: 'Ultra-Luxury', images: [IMG.pendant_a, IMG.ring_b] }),
    jw({ name: 'Diamond Riviera Necklace — 50ct', category: 'necklaces', metal: 'Platinum 950', gem: 'Diamond', carat: 50.0, desc: 'A graduating diamond riviera necklace featuring 47 D-F color VVS diamonds totaling 50 carats.', tier: 'Ultra-Luxury', images: [IMG.necklace_b, IMG.necklace_a] }),
    jw({ name: 'Imperial Jadeite Bangle', category: 'bracelets', metal: '22K Yellow Gold Setting', gem: 'Imperial Jadeite', carat: 0.0, desc: 'An imperial-grade Type A jadeite bangle of exceptional translucency and color saturation.', tier: 'Ultra-Luxury', featured: true, images: [IMG.bracelet_a, IMG.jade] }),
    jw({ name: 'Diamond Tennis Bracelet — 20ct', category: 'bracelets', metal: '18K White Gold', gem: 'Diamond', carat: 20.0, desc: 'A classic tennis bracelet of 50 perfectly matched F-color VS diamonds in a four-prong setting.', tier: 'Luxury', images: [IMG.bracelet_b, IMG.diamond_b] }),
    jw({ name: 'Paraiba Tourmaline Drop Earrings', category: 'earrings', metal: '18K White Gold', gem: 'Paraiba Tourmaline', carat: 5.40, desc: 'Electric neon-blue Paraiba tourmalines suspended from diamond pavé tops.', tier: 'Ultra-Luxury', images: [IMG.earring_a, IMG.earring_b] }),
    jw({ name: 'Pearl & Diamond Chandelier Earrings', category: 'earrings', metal: '18K Yellow Gold', gem: 'South Sea Pearl & Diamond', carat: 8.50, desc: 'South Sea golden pearls suspended from articulated diamond cascades.', tier: 'Luxury', images: [IMG.earring_b, IMG.pearl_a] }),
    jw({ name: 'Phoenix Bridal Crown — Custom', category: 'royal', metal: '22K Gold with Cloisonne Enamel', gem: 'Mixed Gemstones', carat: 35.0, desc: 'A regal phoenix-motif bridal crown set with imperial jadeite, rubies, and pearls. Inspired by Qing dynasty heritage.', tier: 'Ultra-Luxury', images: [USER.bridal_set, IMG.necklace_a] }),
    jw({ name: 'Dragon Phoenix Pendant — Heritage', category: 'chinese_luxury', metal: '24K Yellow Gold', gem: 'Imperial Jadeite & Ruby', carat: 6.80, desc: 'A heritage Chinese luxury pendant featuring intertwined dragon and phoenix motifs in 24K gold.', tier: 'Luxury', images: [IMG.pendant_a, IMG.jade] }),
    jw({ name: 'Bespoke Emerald Pendant Necklace', category: 'custom', metal: 'Platinum & 18K Rose Gold', gem: 'Colombian Emerald', carat: 7.20, desc: 'A custom design featuring a 5.18ct Muzo emerald in a mixed-metal pendant.', tier: 'Luxury', images: [IMG.pendant_a, IMG.emerald_a] }),
    jw({ name: 'Black Opal & Diamond Cocktail Ring', category: 'rings', metal: '18K White Gold', gem: 'Australian Black Opal', carat: 5.60, desc: 'A Lightning Ridge black opal centered in a double-row diamond halo.', tier: 'Luxury', images: [IMG.ring_a, IMG.opal] }),
    jw({ name: 'Eternity Ring — 3ct Diamond', category: 'rings', metal: 'Platinum 950', gem: 'Diamond', carat: 3.0, desc: 'A full eternity band of 24 round brilliant F-color VS diamonds.', tier: 'Luxury', images: [IMG.ring_b, IMG.diamond_c] }),
];

const TESTIMONIALS = [
    { id: crypto.randomUUID(), client_name: 'Mr. Chen Wei', client_title: 'Private Collector', country: 'Hong Kong', message: 'HUANG GEMS sourced an unheated Burmese ruby for my collection that no other dealer could match. The authentication and discretion were unparalleled.', rating: 5, image: null },
    { id: crypto.randomUUID(), client_name: 'Madame V. Dubois', client_title: 'Art Investor', country: 'Paris, France', message: 'A Kashmir sapphire of museum quality, delivered with full Gübelin and SSEF certification. Truly the rarest of the rare.', rating: 5, image: null },
    { id: crypto.randomUUID(), client_name: 'H.E. Sheikh Rashid', client_title: 'Private Office', country: 'Dubai, UAE', message: 'From the first introduction to private viewing, every moment felt curated for the most discerning of clients. A class apart.', rating: 5, image: null },
    { id: crypto.randomUUID(), client_name: 'Mrs. Tanaka', client_title: 'Family Office', country: 'Tokyo, Japan', message: 'The imperial jadeite bangle is a generational heirloom. The provenance documentation is impeccable.', rating: 5, image: null },
    { id: crypto.randomUUID(), client_name: 'Dr. M. Patel', client_title: 'Gemstone Investor', country: 'Mumbai, India', message: 'Investment-grade certifications and proven provenance — exactly what serious collectors require. Highly recommended.', rating: 5, image: null },
    { id: crypto.randomUUID(), client_name: 'Lord A. Whitfield', client_title: 'Heritage Collector', country: 'London, UK', message: 'A Mozambique pigeon blood ruby of exceptional saturation. HUANG GEMS represents the very pinnacle of the trade.', rating: 5, image: null },
];

const CERTIFICATIONS = [
    { id: crypto.randomUUID(), name: 'GIA', full_name: 'Gemological Institute of America', description: "The world's foremost authority on diamonds, colored stones, and pearls.", logo_text: 'GIA' },
    { id: crypto.randomUUID(), name: 'IGI', full_name: 'International Gemological Institute', description: 'Global leader in independent gemological assessment.', logo_text: 'IGI' },
    { id: crypto.randomUUID(), name: 'HRD', full_name: 'Hoge Raad voor Diamant — Antwerp', description: 'European authority on diamond grading and authentication.', logo_text: 'HRD' },
    { id: crypto.randomUUID(), name: 'SSEF', full_name: 'Swiss Gemmological Institute', description: 'Renowned globally for colored stone and pearl identification.', logo_text: 'SSEF' },
    { id: crypto.randomUUID(), name: 'Gübelin', full_name: 'Gübelin Gem Lab — Lucerne', description: 'The gold standard for colored gemstone origin determination.', logo_text: 'Gübelin' },
];

const OFFERS = [
    { id: crypto.randomUUID(), title: 'Rare Ruby Collection 2025', subtitle: 'Burmese & Mozambique Pigeon Blood', description: 'A private viewing of untreated Burmese and Mozambique rubies, each accompanied by SSEF or GRS origin reports.', banner_image: IMG.offer_ruby, accent_color: '#DC2626', link_target: '#gemstones', active: true, created_at: new Date() },
    { id: crypto.randomUUID(), title: 'Sapphire Royal Collection', subtitle: 'Ceylon & Kashmir Origins', description: 'Investment-grade sapphires with verified origin, including the legendary Kashmir cornflower blue.', banner_image: IMG.offer_sapphire, accent_color: '#2563EB', link_target: '#gemstones', active: true, created_at: new Date() },
    { id: crypto.randomUUID(), title: 'Emerald Investment Stones', subtitle: 'Colombian Muzo Garden Emeralds', description: 'Hand-selected Muzo emeralds with exceptional crystal and saturation — Gübelin certified.', banner_image: IMG.offer_emerald, accent_color: '#10B981', link_target: '#gemstones', active: true, created_at: new Date() },
    { id: crypto.randomUUID(), title: 'Bridal Luxury Suites', subtitle: 'Heritage Designs · Bespoke Commissions', description: 'Imperial-inspired bridal sets combining diamond cascades with heritage Chinese motifs.', banner_image: IMG.offer_bridal, accent_color: '#D4AF37', link_target: '#collections', active: true, created_at: new Date() },
];

async function seedData() {
    // Always wipe + reseed gemstones/jewelry/offers/testimonials/certifications so updated image URLs propagate.
    // Inquiries are preserved. Admin is preserved if exists.
    await Promise.all([
        Gemstone.deleteMany({}),
        Jewelry.deleteMany({}),
        Offer.deleteMany({}),
        Testimonial.deleteMany({}),
        Certification.deleteMany({}),
    ]);
    await Promise.all([
        Gemstone.insertMany(GEMSTONES),
        Jewelry.insertMany(JEWELRY),
        Offer.insertMany(OFFERS),
        Testimonial.insertMany(TESTIMONIALS),
        Certification.insertMany(CERTIFICATIONS),
    ]);
    if (await Admin.countDocuments({}) === 0) {
        await Admin.create({
            id: crypto.randomUUID(),
            email: 'admin@huanggems.com',
            hashed_password: bcrypt.hashSync('Admin@2025', 10),
            name: 'Master Curator',
            created_at: new Date(),
        });
    }
    console.log(`[node-backend] seed complete (gemstones=${GEMSTONES.length}, jewelry=${JEWELRY.length}, testimonials=${TESTIMONIALS.length}, certifications=${CERTIFICATIONS.length}, offers=${OFFERS.length})`);
}

module.exports = seedData;
