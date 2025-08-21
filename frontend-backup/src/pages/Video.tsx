import React, { useEffect, useRef } from 'react';
import ContentBlockDark from '../components/ui/ContentBlockDark';
import OptimizedYouTube from '../components/layout/OptimizedYouTube';
import { useVideos } from '../context/VideosContext';

const Video = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { videos, loading, error } = useVideos();

    if (loading) {
        return (
            <div
                className="container"
                style={{
                    marginTop: '4rem',
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                }}
            >
                Loading videos...
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="container"
                style={{
                    marginTop: '4rem',
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f44336',
                }}
            >
                Error loading videos: {error}
            </div>
        );
    }

    useEffect(() => {
        // Add passive event listeners for better performance
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = (e: Event) => {
            // Handle scroll events without blocking
            // This could be used for lazy loading or other optimizations
        };

        const handleWheel = (e: WheelEvent) => {
            // Handle wheel events without blocking
            // Only preventDefault if absolutely necessary
        };

        // Add passive listeners
        container.addEventListener('scroll', handleScroll, { passive: true });
        container.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="container"
            style={{ marginTop: '4rem' }}
        >
            <ContentBlockDark>
                <section className="section">
                    <h1
                        className="text-center"
                        style={{ marginBottom: '2rem' }}
                    >
                        Video
                    </h1>
                    <div
                        style={{
                            maxWidth: '680px',
                            margin: '0 auto',
                            width: '90%',
                        }}
                    >
                        {videos.map((video, index) => (
                            <ContentBlockDark
                                key={video.id}
                                className="video-content-block"
                            >
                                <div
                                    className="video-inner-div"
                                    style={{
                                        padding: '1rem',
                                        border: '1px solid rgba(255,255,255,0.18)',
                                        borderRadius: '3px',
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    <OptimizedYouTube
                                        videoId={video.youtubeId}
                                        title={video.title}
                                        lazy={index > 1} // Lazy load videos after the first two
                                    />
                                </div>
                            </ContentBlockDark>
                        ))}
                    </div>
                </section>
            </ContentBlockDark>
        </div>
    );
};

export default Video;
