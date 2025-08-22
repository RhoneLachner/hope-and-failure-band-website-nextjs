'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { validateAdminPassword, SETUP_INSTRUCTIONS } from '../../config/auth';

// PERFORMANCE: Lazy load admin components with dynamic imports
// This reduces initial bundle size and loads components only when needed
const AdminInventory = dynamic(
    () => import('../../components/admin/AdminInventory'),
    {
        loading: () => (
            <AdminLoadingState>Loading Inventory...</AdminLoadingState>
        ),
        ssr: false, // Admin components don't need SSR
    }
);

const AdminEvents = dynamic(
    () => import('../../components/admin/AdminEvents'),
    {
        loading: () => <AdminLoadingState>Loading Events...</AdminLoadingState>,
        ssr: false,
    }
);

const AdminVideos = dynamic(
    () => import('../../components/admin/AdminVideos'),
    {
        loading: () => <AdminLoadingState>Loading Videos...</AdminLoadingState>,
        ssr: false,
    }
);

const AdminBio = dynamic(() => import('../../components/admin/AdminBio'), {
    loading: () => <AdminLoadingState>Loading Bio...</AdminLoadingState>,
    ssr: false,
});

const AdminLyrics = dynamic(
    () => import('../../components/admin/AdminLyrics'),
    {
        loading: () => <AdminLoadingState>Loading Lyrics...</AdminLoadingState>,
        ssr: false,
    }
);

// Loading state component for admin sections
const AdminLoadingState: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            color: '#fff',
            fontSize: '1.1rem',
            opacity: 0.7,
        }}
    >
        <div style={{ textAlign: 'center' }}>
            <div
                style={{
                    marginBottom: '1rem',
                    fontSize: '1.5rem',
                }}
            >
                ⏳
            </div>
            {children}
        </div>
    </div>
);

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading] = useState(false);
    const [message, setMessage] = useState('');

    const [activeTab, setActiveTab] = useState<
        'inventory' | 'events' | 'videos' | 'bio' | 'lyrics'
    >('inventory');

    // Auto-clear success messages after 3 seconds
    useEffect(() => {
        if (message && message.includes('✅')) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const authenticate = () => {
        if (validateAdminPassword(password)) {
            setIsAuthenticated(true);
            setMessage('✅ Authentication successful');
            console.log('✅ Admin authenticated successfully');
        } else {
            setMessage('❌ Invalid password');
            console.warn('❌ Failed admin authentication attempt');
        }
    };

    if (!isAuthenticated) {
        return (
            <div
                style={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem',
                    color: '#fff',
                }}
            >
                <h1
                    style={{
                        marginBottom: '2rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}
                >
                    Admin Portal
                </h1>
                <div
                    style={{
                        background: 'rgba(20, 20, 20, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '2rem',
                        minWidth: '300px',
                    }}
                >
                    <input
                        type="password"
                        placeholder="Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && authenticate()}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            marginBottom: '1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '1rem',
                        }}
                    />
                    <button
                        onClick={authenticate}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'none',
                            border: '1px solid #4CAF50',
                            borderRadius: '6px',
                            color: '#4CAF50',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}
                    >
                        Login
                    </button>
                    {message && (
                        <p
                            style={{
                                marginTop: '1rem',
                                textAlign: 'center',
                                fontSize: '0.9rem',
                            }}
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Tab button component for cleaner code
    const TabButton: React.FC<{
        label: string;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, isActive, onClick }) => (
        <button
            onClick={onClick}
            style={{
                padding: '0.75rem 1.5rem',
                background: isActive ? '#4CAF50' : 'none',
                border: '1px solid #4CAF50',
                borderRadius: '6px',
                color: isActive ? '#000' : '#4CAF50',
                fontSize: '1rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
            }}
        >
            {label}
        </button>
    );

    return (
        <div
            style={{
                minHeight: '60vh',
                padding: '2rem',
                color: '#fff',
            }}
        >
            <h1
                style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                }}
            >
                Admin Dashboard
            </h1>

            {/* Tab Navigation */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}
            >
                <TabButton
                    label="Inventory"
                    isActive={activeTab === 'inventory'}
                    onClick={() => setActiveTab('inventory')}
                />
                <TabButton
                    label="Events"
                    isActive={activeTab === 'events'}
                    onClick={() => setActiveTab('events')}
                />
                <TabButton
                    label="Videos"
                    isActive={activeTab === 'videos'}
                    onClick={() => setActiveTab('videos')}
                />
                <TabButton
                    label="Bio"
                    isActive={activeTab === 'bio'}
                    onClick={() => setActiveTab('bio')}
                />
                <TabButton
                    label="Lyrics"
                    isActive={activeTab === 'lyrics'}
                    onClick={() => setActiveTab('lyrics')}
                />
            </div>

            {/* Tab Content - Performance optimized with lazy loading */}
            <Suspense
                fallback={
                    <AdminLoadingState>
                        Loading admin content...
                    </AdminLoadingState>
                }
            >
                {activeTab === 'inventory' && (
                    <AdminInventory
                        password={password}
                        setMessage={setMessage}
                        message={message}
                    />
                )}

                {activeTab === 'events' && (
                    <AdminEvents
                        setMessage={setMessage}
                        message={message}
                        loading={loading}
                    />
                )}

                {activeTab === 'videos' && (
                    <AdminVideos
                        setMessage={setMessage}
                        message={message}
                        loading={loading}
                    />
                )}

                {activeTab === 'bio' && (
                    <AdminBio
                        setMessage={setMessage}
                        message={message}
                        loading={loading}
                    />
                )}

                {activeTab === 'lyrics' && (
                    <AdminLyrics
                        setMessage={setMessage}
                        message={message}
                        loading={loading}
                    />
                )}
            </Suspense>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
