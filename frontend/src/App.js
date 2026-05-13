import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { Toaster } from 'sonner';
import { LangProvider } from './lib/LangContext';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/admin/AdminRoute';
import './App.css';

function App() {
    useEffect(() => {
        // Lenis smooth scroll (skip on touch devices to avoid conflicts)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return undefined;
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.0,
        });
        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return (
        <div className="App dark">
            <LangProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route
                            path="/admin/*"
                            element={
                                <AdminRoute>
                                    <AdminDashboardPage />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </LangProvider>
            <Toaster
                position="top-center"
                theme="dark"
                toastOptions={{
                    style: {
                        background: 'rgba(11, 15, 26, 0.95)',
                        backdropFilter: 'blur(18px)',
                        border: '1px solid rgba(212, 175, 55, 0.28)',
                        color: 'rgba(255, 255, 255, 0.92)',
                    },
                }}
            />
        </div>
    );
}

export default App;
