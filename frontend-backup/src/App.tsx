import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/header';
import ImagePreloader from './components/layout/ImagePreloader';
import CartSidebar from './components/layout/CartSidebar';
import FloatingCartIcon from './components/layout/FloatingCartIcon';
import ErrorToast from './components/ui/ErrorToast';
import { CartProvider, useCart } from './context/CartContext';
import { EventsProvider } from './context/EventsContext';
import { VideosProvider } from './context/VideosContext';
import { BioProvider } from './context/BioContext';
import { LyricsProvider } from './context/LyricsContext';
import { performanceOptimizer } from './utils/performance';
import './utils/emailTest';
import './styles/global.sass';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Success from './pages/checkout/Success';
import Cancel from './pages/checkout/Cancel';
import Lyrics from './pages/Lyrics';
import Music from './pages/Music';
import Video from './pages/Video';
import Bio from './pages/Bio';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

const AppContent: React.FC = () => {
    const { errors, clearErrors } = useCart();

    // Optimize global event listeners
    useEffect(() => {
        // Add optimized passive listeners for common scroll/touch events
        const cleanupFunctions: (() => void)[] = [];

        // Optimize scroll events globally
        const optimizedScrollHandler = performanceOptimizer.throttle(
            (_e: Event) => {
                // Global scroll optimizations can go here
            },
            16
        ); // ~60fps

        // Optimize touch events
        const optimizedTouchHandler = performanceOptimizer.throttle(
            (_e: TouchEvent) => {
                // Global touch optimizations can go here
            },
            16
        );

        // Add passive listeners
        cleanupFunctions.push(
            performanceOptimizer.addPassiveListener(
                document.body,
                'scroll',
                optimizedScrollHandler,
                { passive: true, capture: true }
            )
        );

        cleanupFunctions.push(
            performanceOptimizer.addPassiveListener(
                document.body,
                'touchstart',
                optimizedTouchHandler,
                { passive: true }
            )
        );

        cleanupFunctions.push(
            performanceOptimizer.addPassiveListener(
                document.body,
                'touchmove',
                optimizedTouchHandler,
                { passive: true }
            )
        );

        return () => {
            cleanupFunctions.forEach((cleanup) => cleanup());
        };
    }, []);

    const handleClearError = (_timestamp: number) => {
        // For now, clear all errors. In a more sophisticated implementation,
        // you could track individual error timestamps
        clearErrors();
    };

    return (
        <>
            <ImagePreloader />
            <Header />
            <main className="main-content" style={{ padding: '2rem' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/lyrics" element={<Lyrics />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/video" element={<Video />} />
                    <Route path="/bio" element={<Bio />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/checkout/success" element={<Success />} />
                    <Route path="/checkout/cancel" element={<Cancel />} />
                </Routes>
            </main>
            <CartSidebar />
            <FloatingCartIcon />
            <ErrorToast errors={errors} onClearError={handleClearError} />
        </>
    );
};

const App: React.FC = () => (
    <CartProvider>
        <EventsProvider>
            <VideosProvider>
                <BioProvider>
                    <LyricsProvider>
                        <BrowserRouter>
                            <AppContent />
                        </BrowserRouter>
                    </LyricsProvider>
                </BioProvider>
            </VideosProvider>
        </EventsProvider>
    </CartProvider>
);

export default App;
