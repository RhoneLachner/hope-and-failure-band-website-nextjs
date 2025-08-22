'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    fill?: boolean;
    sizes?: string;
    quality?: number;
    loading?: 'lazy' | 'eager';
    onLoad?: () => void;
    onError?: () => void;
}

/**
 * Performance-optimized Image component with enhanced features:
 * - WebP/AVIF format support
 * - Lazy loading by default
 * - Blur placeholder support
 * - Error handling with fallback
 * - Loading state management
 * - Responsive sizing
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    className = '',
    style = {},
    priority = false,
    placeholder = 'blur',
    blurDataURL,
    fill = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality = 85,
    loading = 'lazy',
    onLoad,
    onError,
}) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Generate a simple blur placeholder if none provided
    const defaultBlurDataURL =
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        setImageError(true);
        setIsLoading(false);
        onError?.();
    };

    // Error fallback component
    if (imageError) {
        return (
            <div
                className={`image-error-fallback ${className}`}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.9rem',
                    ...style,
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                        📷
                    </div>
                    <div>Image unavailable</div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`optimized-image-container ${className}`}
            style={{ position: 'relative', ...style }}
        >
            {/* Loading overlay */}
            {isLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        borderRadius: '8px',
                    }}
                >
                    <div
                        style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '1.2rem',
                        }}
                    >
                        ⏳
                    </div>
                </div>
            )}

            <Image
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                priority={priority}
                placeholder={placeholder}
                blurDataURL={
                    blurDataURL ||
                    (placeholder === 'blur' ? defaultBlurDataURL : undefined)
                }
                sizes={fill ? sizes : undefined}
                quality={quality}
                loading={priority ? 'eager' : loading}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                    transition: 'opacity 0.3s ease',
                    opacity: isLoading ? 0.7 : 1,
                }}
            />
        </div>
    );
};

export default OptimizedImage;
