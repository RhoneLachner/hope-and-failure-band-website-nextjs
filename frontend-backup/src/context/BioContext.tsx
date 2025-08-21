import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import type { ReactNode } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export interface PhotoCredit {
    name: string;
    instagram: string;
    url: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export interface Bio {
    id: string;
    mainText: string[];
    bandImage: string;
    pastMembers: string[];
    photography: PhotoCredit[];
}

interface BioContextType {
    bio: Bio | null;
    loading: boolean;
    error: string | null;
    fetchBio: () => Promise<void>;
    updateBio: (bioData: Partial<Bio>) => Promise<boolean>;
    clearError: () => void;
}

const BioContext = createContext<BioContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useBio = () => {
    const context = useContext(BioContext);
    if (context === undefined) {
        throw new Error('useBio must be used within a BioProvider');
    }
    return context;
};

interface BioProviderProps {
    children: ReactNode;
}

const ADMIN_PASSWORD = 'admin123'; // Same as other admin functions

export const BioProvider: React.FC<BioProviderProps> = ({ children }) => {
    const [bio, setBio] = useState<Bio | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const fetchBio = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/api/bio');
            const result = await response.json();

            if (result.success) {
                setBio(result.bio);
                console.log('👥 Bio fetched successfully');
            } else {
                throw new Error(result.error || 'Failed to fetch bio');
            }
        } catch (error) {
            console.error('❌ Error fetching bio:', error);
            setError('Failed to load bio');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBio = useCallback(
        async (bioData: Partial<Bio>): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    'http://localhost:3000/api/admin/bio',
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            password: ADMIN_PASSWORD,
                            ...bioData,
                        }),
                    }
                );

                const result = await response.json();

                if (result.success) {
                    setBio(result.bio);
                    console.log('✅ Bio updated successfully');
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to update bio');
                }
            } catch (error) {
                console.error('❌ Error updating bio:', error);
                setError('Failed to update bio');
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Load bio on mount
    useEffect(() => {
        fetchBio();
    }, [fetchBio]);

    const value: BioContextType = {
        bio,
        loading,
        error,
        fetchBio,
        updateBio,
        clearError,
    };

    return <BioContext.Provider value={value}>{children}</BioContext.Provider>;
};

export default BioContext;
