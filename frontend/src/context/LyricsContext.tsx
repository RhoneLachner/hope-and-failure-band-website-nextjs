'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { getAdminPassword } from '../config/auth';

export interface Song {
    id: string;
    title: string;
    lyrics: string;
    order: number;
    isInstrumental: boolean;
}

interface LyricsContextType {
    lyrics: Song[];
    loading: boolean;
    error: string | null;
    fetchLyrics: () => Promise<void>;
    addSong: (songData: Omit<Song, 'id'>) => Promise<boolean>;
    updateSong: (id: string, songData: Partial<Song>) => Promise<boolean>;
    deleteSong: (id: string) => Promise<boolean>;
    clearError: () => void;
}

const LyricsContext = createContext<LyricsContextType | undefined>(undefined);

export const useLyrics = () => {
    const context = useContext(LyricsContext);
    if (context === undefined) {
        throw new Error('useLyrics must be used within a LyricsProvider');
    }
    return context;
};

interface LyricsProviderProps {
    children: ReactNode;
}

const ADMIN_PASSWORD = getAdminPassword(); // Secure admin password from configuration

export const LyricsProvider: React.FC<LyricsProviderProps> = ({ children }) => {
    const [lyrics, setLyrics] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const fetchLyrics = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/lyrics');
            const result = await response.json();

            if (result.success) {
                setLyrics(result.lyrics);
                console.log(
                    '🎵 Lyrics fetched successfully:',
                    result.lyrics.length
                );
            } else {
                throw new Error(result.error || 'Failed to fetch lyrics');
            }
        } catch (error) {
            console.error('❌ Error fetching lyrics:', error);
            setError('Failed to load lyrics');
        } finally {
            setLoading(false);
        }
    }, []);

    const addSong = useCallback(
        async (songData: Omit<Song, 'id'>): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/admin/lyrics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: ADMIN_PASSWORD,
                        ...songData,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setLyrics((prevLyrics) => {
                        const newLyrics = [...prevLyrics, result.song];
                        return newLyrics.sort((a, b) => a.order - b.order);
                    });
                    console.log(
                        '✅ Song added successfully:',
                        result.song.title
                    );
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to add song');
                }
            } catch (error) {
                console.error('❌ Error adding song:', error);
                setError('Failed to add song');
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const updateSong = useCallback(
        async (id: string, songData: Partial<Song>): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/admin/lyrics/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: ADMIN_PASSWORD,
                        ...songData,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setLyrics((prevLyrics) => {
                        const updatedLyrics = prevLyrics.map((song) =>
                            song.id === id ? result.song : song
                        );
                        return updatedLyrics.sort((a, b) => a.order - b.order);
                    });
                    console.log(
                        '✅ Song updated successfully:',
                        result.song.title
                    );
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to update song');
                }
            } catch (error) {
                console.error('❌ Error updating song:', error);
                setError('Failed to update song');
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const deleteSong = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/lyrics/${id}`, {
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
                setLyrics((prevLyrics) =>
                    prevLyrics.filter((song) => song.id !== id)
                );
                console.log(
                    '✅ Song deleted successfully:',
                    result.deletedSong.title
                );
                return true;
            } else {
                throw new Error(result.error || 'Failed to delete song');
            }
        } catch (error) {
            console.error('❌ Error deleting song:', error);
            setError('Failed to delete song');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Load lyrics on mount
    useEffect(() => {
        fetchLyrics();
    }, []); // ✅ Empty dependency array - run only once on mount

    const value: LyricsContextType = {
        lyrics,
        loading,
        error,
        fetchLyrics,
        addSong,
        updateSong,
        deleteSong,
        clearError,
    };

    return (
        <LyricsContext.Provider value={value}>
            {children}
        </LyricsContext.Provider>
    );
};

export default LyricsContext;
