// Performance optimization utilities

interface PerformanceOptions {
    enableLogging?: boolean;
    enableMetrics?: boolean;
}

class PerformanceOptimizer {
    private options: PerformanceOptions;
    private rafId: number | null = null;
    private idleCallbacks: Set<number> = new Set();

    constructor(options: PerformanceOptions = {}) {
        this.options = {
            enableLogging: false,
            enableMetrics: false,
            ...options,
        };
    }

    // Optimized event listener attachment
    addPassiveListener<K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        type: K,
        listener: (event: HTMLElementEventMap[K]) => void,
        options: AddEventListenerOptions = {}
    ): () => void {
        const listenerOptions = {
            passive: true,
            ...options,
        };

        element.addEventListener(type, listener, listenerOptions);

        return () => {
            element.removeEventListener(type, listener, listenerOptions);
        };
    }

    // Optimized setTimeout with idle callback fallback
    scheduleTask(
        callback: () => void,
        delay: number = 0,
        options: { useIdle?: boolean; timeout?: number } = {}
    ): () => void {
        const { useIdle = true, timeout = 5000 } = options;

        if (useIdle && 'requestIdleCallback' in window && delay === 0) {
            const id = requestIdleCallback(callback, { timeout });
            this.idleCallbacks.add(id);

            return () => {
                if (this.idleCallbacks.has(id)) {
                    cancelIdleCallback(id);
                    this.idleCallbacks.delete(id);
                }
            };
        }

        const timeoutId = setTimeout(callback, delay);
        return () => clearTimeout(timeoutId);
    }

    // Debounced function for expensive operations
    debounce<T extends (...args: any[]) => any>(
        func: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let timeoutId: number;

        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => func(...args), delay);
        };
    }

    // Throttled function for frequent events
    throttle<T extends (...args: any[]) => any>(
        func: T,
        limit: number
    ): (...args: Parameters<T>) => void {
        let inThrottle: boolean;

        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    // Optimized animation frame handling
    requestAnimationFrame(callback: FrameRequestCallback): () => void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }

        this.rafId = requestAnimationFrame((timestamp) => {
            this.rafId = null;
            callback(timestamp);
        });

        return () => {
            if (this.rafId !== null) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        };
    }

    // Measure performance of functions (logging disabled)
    measurePerformance<T>(name: string, func: () => T): T {
        // Just execute the function without logging to reduce console noise
        return func();
    }

    // Check if device prefers reduced motion
    prefersReducedMotion(): boolean {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Check device capabilities
    getDeviceCapabilities() {
        return {
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            deviceMemory: (navigator as any).deviceMemory || 4,
            connection: (navigator as any).connection,
            supportsTouchEvents: 'ontouchstart' in window,
            supportsPointerEvents: 'onpointerdown' in window,
            supportsPassiveEvents: this.checkPassiveSupport(),
            supportsIntersectionObserver: 'IntersectionObserver' in window,
            supportsRequestIdleCallback: 'requestIdleCallback' in window,
        };
    }

    // Check if passive events are supported
    private checkPassiveSupport(): boolean {
        let passiveSupported = false;

        try {
            const options = {
                get passive() {
                    passiveSupported = true;
                    return false;
                },
            };

            window.addEventListener(
                'test',
                () => {},
                options as EventListenerOptions
            );
            window.removeEventListener(
                'test',
                () => {},
                options as EventListenerOptions
            );
        } catch (err) {
            passiveSupported = false;
        }

        return passiveSupported;
    }

    // Optimize images for better loading
    optimizeImageLoading(
        img: HTMLImageElement,
        options: {
            lazy?: boolean;
            priority?: 'high' | 'low' | 'auto';
            sizes?: string;
        } = {}
    ): void {
        const { lazy = true, priority = 'auto', sizes } = options;

        if (lazy && 'loading' in img) {
            img.loading = 'lazy';
        }

        if ('fetchPriority' in img) {
            (img as any).fetchPriority = priority;
        }

        if (sizes) {
            img.sizes = sizes;
        }

        // Add decode hint for better performance
        if ('decoding' in img) {
            img.decoding = 'async';
        }
    }

    // Clean up all scheduled tasks
    cleanup(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        this.idleCallbacks.forEach((id) => {
            if ('cancelIdleCallback' in window) {
                cancelIdleCallback(id);
            }
        });
        this.idleCallbacks.clear();
    }

    // Log performance metrics (disabled)
    logPerformanceMetrics(): void {
        // Performance logging disabled to reduce console noise
        return;
    }
}

// Export singleton instance
export const performanceOptimizer = new PerformanceOptimizer({
    enableLogging: false, // Disabled to reduce console noise
    enableMetrics: false, // Disabled to reduce console noise
});

// Auto-initialize performance monitoring (disabled)
if (typeof window !== 'undefined') {
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        performanceOptimizer.cleanup();
    });
}

export default PerformanceOptimizer;
