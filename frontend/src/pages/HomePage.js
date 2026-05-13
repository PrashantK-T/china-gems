import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedShowcase from '../components/FeaturedShowcase';
import GemstonesCatalog from '../components/GemstonesCatalog';
import JewelryCollections from '../components/JewelryCollections';
import CraftsmanshipTimeline from '../components/CraftsmanshipTimeline';
import Certifications from '../components/Certifications';
import GlobalPresence from '../components/GlobalPresence';
import Testimonials from '../components/Testimonials';
import ExclusiveOffers from '../components/ExclusiveOffers';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ProductDetailModal from '../components/ProductDetailModal';
import { fetchGemstone, fetchJewelryItem } from '../lib/api';

export default function HomePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalItem, setModalItem] = useState(null);
    const [modalType, setModalType] = useState('gemstone');

    // Wrapper that fetches latest data so featured cards (minimal data) still get full product detail.
    const openProduct = useCallback(async (item, type = 'gemstone') => {
        setModalType(type);
        // If 'item' is a full backend record (has gemstone_family or category), use as-is
        if (item && (item.gemstone_family || item.category || item.metal_type)) {
            setModalItem(item);
            setModalOpen(true);
            return;
        }
        // Otherwise treat as featured-card minimal item (rich preview only)
        setModalItem(item);
        setModalOpen(true);
    }, []);

    const openInquireScroll = useCallback(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <div id="home-page" className="relative min-h-screen bg-[var(--hg-bg-0)]">
            <Navbar onInquireClick={openInquireScroll} />
            <main>
                <Hero />
                <FeaturedShowcase onView={openProduct} />
                <GemstonesCatalog onView={openProduct} />
                <JewelryCollections onView={openProduct} />
                <ExclusiveOffers onInquireClick={openInquireScroll} />
                <CraftsmanshipTimeline />
                <Certifications />
                <GlobalPresence />
                <Testimonials />
                <About />
                <Contact />
            </main>
            <Footer />
            <ProductDetailModal
                item={modalItem}
                type={modalType}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}
