'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import type { ReactNode } from 'react';

export interface Video {
    id: string;
    youtubeId: string;
    title: string;
    description?: string;
    order: number;
}

interface VideosContextType {
    videos: Video[];
    loading: boolean;
    error: string | null;
    fetchVideos: () => Promise<void>;
    addVideo: (videoData: Omit<Video, 'id'>) => Promise<boolean>;
    updateVideo: (id: string, videoData: Partial<Video>) => Promise<boolean>;
    deleteVideo: (id: string) => Promise<boolean>;
    clearError: () => void;
}

const VideosContext = createContext<VideosContextType | undefined>(undefined);

export const useVideos = () => {
    const context = useContext(VideosContext);
    if (context === undefined) {
        throw new Error('useVideos must be used within a VideosProvider');
    }
    return context;
};

interface VideosProviderProps {
    children: ReactNode;
}

const ADMIN_PASSWORD = 'admin123'; // Same as other admin functions

export const VideosProvider: React.FC<VideosProviderProps> = ({ children }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/videos');
            const result = await response.json();

            if (result.success) {
                setVideos(result.videos);
                console.log(
                    '📹 Videos fetched successfully:',
                    result.videos.length
                );
            } else {
                throw new Error(result.error || 'Failed to fetch videos');
            }
        } catch (error) {
            console.error('❌ Error fetching videos:', error);
            setError('Failed to load videos');
        } finally {
            setLoading(false);
        }
    }, []);

    const addVideo = useCallback(
        async (videoData: Omit<Video, 'id'>): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/admin/videos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: ADMIN_PASSWORD,
                        ...videoData,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setVideos((prevVideos) => {
                        const newVideos = [...prevVideos, result.video];
                        return newVideos.sort((a, b) => a.order - b.order);
                    });
                    console.log(
                        '✅ Video added successfully:',
                        result.video.title
                    );
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to add video');
                }
            } catch (error) {
                console.error('❌ Error adding video:', error);
                setError('Failed to add video');
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const updateVideo = useCallback(
        async (id: string, videoData: Partial<Video>): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/admin/videos/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: ADMIN_PASSWORD,
                        ...videoData,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setVideos((prevVideos) => {
                        const updatedVideos = prevVideos.map((video) =>
                            video.id === id ? result.video : video
                        );
                        return updatedVideos.sort((a, b) => a.order - b.order);
                    });
                    console.log(
                        '✅ Video updated successfully:',
                        result.video.title
                    );
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to update video');
                }
            } catch (error) {
                console.error('❌ Error updating video:', error);
                setError('Failed to update video');
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const deleteVideo = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/videos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: ADMIN_PASSWORD,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setVideos((prevVideos) =>
                    prevVideos.filter((video) => video.id !== id)
                );
                console.log(
                    '✅ Video deleted successfully:',
                    result.deletedVideo.title
                );
                return true;
            } else {
                throw new Error(result.error || 'Failed to delete video');
            }
        } catch (error) {
            console.error('❌ Error deleting video:', error);
            setError('Failed to delete video');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Load videos on mount (client-side only)
    useEffect(() => {
        // Only fetch on client-side to avoid SSR issues
        if (typeof window !== 'undefined') {
            console.log(
                '🔄 VideosProvider useEffect triggered - calling fetchVideos'
            );
            fetchVideos();
        }
    }, [fetchVideos]);

    const value: VideosContextType = {
        videos,
        loading,
        error,
        fetchVideos,
        addVideo,
        updateVideo,
        deleteVideo,
        clearError,
    };

    return (
        <VideosContext.Provider value={value}>
            {children}
        </VideosContext.Provider>
    );
};

export default VideosContext;
