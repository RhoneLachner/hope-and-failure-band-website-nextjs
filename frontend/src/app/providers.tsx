'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '../components/layout/header';
import ImagePreloader from '../components/layout/ImagePreloader';
import CartSidebar from '../components/layout/CartSidebar';
import FloatingCartIcon from '../components/layout/FloatingCartIcon';
import ErrorToast from '../components/ui/ErrorToast';
import { CartProvider, useCart } from '../context/CartContext';
import { EventsProvider } from '../context/EventsContext';
import { VideosProvider } from '../context/VideosContext';
import { BioProvider } from '../context/BioContext';
import { LyricsProvider } from '../context/LyricsContext';
import { performanceOptimizer } from '../utils/performance';
import '../utils/emailTest';

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { errors, clearErrors } = useCart();
    const pathname = usePathname();

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
        if (typeof document !== 'undefined') {
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
        }

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
                {children}
            </main>
            <CartSidebar />
            <FloatingCartIcon />
            <ErrorToast errors={errors} onClearError={handleClearError} />
        </>
    );
};

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <CartProvider>
        <EventsProvider>
            <VideosProvider>
                <BioProvider>
                    <LyricsProvider>
                        <AppContent>
                            {children}
                        </AppContent>
                    </LyricsProvider>
                </BioProvider>
            </VideosProvider>
        </EventsProvider>
    </CartProvider>
);
