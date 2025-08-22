import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

/**
 * Performance optimization hooks for React components
 */

/**
 * Hook to measure component render performance
 * Useful for identifying performance bottlenecks
 */
export const useRenderTime = (
    componentName: string,
    enabled = process.env.NODE_ENV === 'development'
) => {
    const renderStartTime = useRef<number>(0);

    useEffect(() => {
        if (!enabled) return;

        renderStartTime.current = performance.now();

        return () => {
            const renderTime = performance.now() - renderStartTime.current;
            if (renderTime > 16) {
                // Log slow renders (>16ms = below 60fps)
                console.warn(
                    `⚠️ Slow render: ${componentName} took ${renderTime.toFixed(
                        2
                    )}ms`
                );
            } else {
                console.log(
                    `✅ Fast render: ${componentName} took ${renderTime.toFixed(
                        2
                    )}ms`
                );
            }
        };
    });
};

/**
 * Optimized debounce hook for performance-critical operations
 * Prevents excessive API calls or expensive operations
 */
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Intersection Observer hook for lazy loading optimization
 * Triggers callback when element enters viewport
 */
export const useIntersectionObserver = (
    options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [element, setElement] = useState<Element | null>(null);

    const callbackRef = useCallback((el: Element | null) => {
        setElement(el);
    }, []);

    useEffect(() => {
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [element, options]);

    return [callbackRef, isIntersecting];
};

/**
 * Optimized fetch hook with caching and error handling
 * Prevents duplicate requests and implements smart caching
 */
export const useOptimizedFetch = <T>(
    url: string,
    options: RequestInit = {},
    dependencies: any[] = []
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cache to prevent duplicate requests
    const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(
        new Map()
    );
    const cacheTimeout = 5 * 60 * 1000; // 5 minutes

    const fetchData = useCallback(async () => {
        const cacheKey = url + JSON.stringify(options);
        const cached = cacheRef.current.get(cacheKey);

        // Return cached data if still valid
        if (cached && Date.now() - cached.timestamp < cacheTimeout) {
            setData(cached.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Cache the result
            cacheRef.current.set(cacheKey, {
                data: result,
                timestamp: Date.now(),
            });

            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [url, ...dependencies]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

/**
 * Memory optimization hook for large lists
 * Implements virtual scrolling concepts
 */
export const useVirtualList = <T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
) => {
    const [scrollTop, setScrollTop] = useState(0);

    const visibleRange = useMemo(() => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(
            startIndex + Math.ceil(containerHeight / itemHeight) + 1,
            items.length
        );

        return {
            start: Math.max(0, startIndex - 2), // Buffer items
            end: endIndex + 2, // Buffer items
        };
    }, [scrollTop, itemHeight, containerHeight, items.length]);

    const visibleItems = useMemo(() => {
        return items
            .slice(visibleRange.start, visibleRange.end)
            .map((item, index) => ({
                item,
                index: visibleRange.start + index,
            }));
    }, [items, visibleRange]);

    const totalHeight = items.length * itemHeight;

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
    }, []);

    return {
        visibleItems,
        totalHeight,
        handleScroll,
        offsetY: visibleRange.start * itemHeight,
    };
};

/**
 * Performance monitoring hook
 * Tracks component performance metrics
 */
export const usePerformanceMonitor = (componentName: string) => {
    const metricsRef = useRef({
        renderCount: 0,
        totalRenderTime: 0,
        lastRenderTime: 0,
    });

    const startTime = useRef<number>(0);

    useEffect(() => {
        startTime.current = performance.now();
        metricsRef.current.renderCount++;

        return () => {
            const renderTime = performance.now() - startTime.current;
            metricsRef.current.lastRenderTime = renderTime;
            metricsRef.current.totalRenderTime += renderTime;

            // Log performance metrics every 10 renders in development
            if (
                process.env.NODE_ENV === 'development' &&
                metricsRef.current.renderCount % 10 === 0
            ) {
                const avgRenderTime =
                    metricsRef.current.totalRenderTime /
                    metricsRef.current.renderCount;
                console.log(`📊 Performance: ${componentName}`, {
                    renders: metricsRef.current.renderCount,
                    avgRenderTime: `${avgRenderTime.toFixed(2)}ms`,
                    lastRenderTime: `${renderTime.toFixed(2)}ms`,
                });
            }
        };
    });

    return {
        getMetrics: () => ({
            renderCount: metricsRef.current.renderCount,
            averageRenderTime:
                metricsRef.current.totalRenderTime /
                metricsRef.current.renderCount,
            lastRenderTime: metricsRef.current.lastRenderTime,
        }),
    };
};
