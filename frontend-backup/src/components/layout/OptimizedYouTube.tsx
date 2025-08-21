import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { performanceOptimizer } from '../../utils/performance';

interface OptimizedYouTubeProps {
    videoId: string;
    title: string;
    lazy?: boolean;
}

const OptimizedYouTube: React.FC<OptimizedYouTubeProps> = memo(
    ({ videoId, title, lazy = true }) => {
        const [isLoaded, setIsLoaded] = useState(false);
        const [isInView, setIsInView] = useState(!lazy);
        const [imageLoaded, setImageLoaded] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);
        const observerRef = useRef<IntersectionObserver | null>(null);

        // Setup intersection observer for lazy loading
        useEffect(() => {
            if (!lazy || !containerRef.current) return;

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setIsInView(true);
                            observerRef.current?.disconnect();
                        }
                    });
                },
                {
                    rootMargin: '50px', // Start loading 50px before coming into view
                    threshold: 0.1,
                }
            );

            observerRef.current.observe(containerRef.current);

            return () => {
                observerRef.current?.disconnect();
            };
        }, [lazy]);

        // Handle thumbnail image load
        const handleImageLoad = useCallback(() => {
            setImageLoaded(true);
        }, []);

        // Handle iframe load
        const handleIframeLoad = useCallback(() => {
            performanceOptimizer.scheduleTask(() => {
                setIsLoaded(true);
            });
        }, []);

        // Optimized click handler for thumbnail
        const handleThumbnailClick = useCallback(() => {
            if (imageLoaded) {
                setIsLoaded(true);
            }
        }, [imageLoaded]);

        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        // Embed URL without autoplay for initial load (shows title)
        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=0&playsinline=1&origin=${encodeURIComponent(
            window.location.origin
        )}`;

        // URL with autoplay for when clicked
        const autoplayEmbedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=0&playsinline=1&autoplay=1&origin=${encodeURIComponent(
            window.location.origin
        )}`;

        return (
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    paddingBottom: '56.25%', // 16:9 aspect ratio
                    height: 0,
                    overflow: 'hidden',
                    borderRadius: '3px',
                    backgroundColor: '#000',
                }}
            >
                {isInView ? (
                    // Show YouTube iframe with native title
                    <iframe
                        src={embedUrl}
                        title={title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={handleIframeLoad}
                        referrerPolicy="strict-origin-when-cross-origin"
                        loading={lazy ? 'lazy' : 'eager'}
                    />
                ) : (
                    // Loading placeholder
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666',
                        }}
                    >
                        <div
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid #333',
                                    borderTop: '3px solid #666',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto 10px',
                                }}
                            />
                            <div style={{ fontSize: '14px' }}>
                                Loading video...
                            </div>
                        </div>
                    </div>
                )}

                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(0deg); }
                        }
                    }
                `}
                </style>
            </div>
        );
    }
);

export default OptimizedYouTube;
