'use client';

import React, { useState, useEffect } from 'react';
import AdminInventory from '../../components/admin/AdminInventory';
import AdminEvents from '../../components/admin/AdminEvents';
import AdminVideos from '../../components/admin/AdminVideos';
import AdminBio from '../../components/admin/AdminBio';
import AdminLyrics from '../../components/admin/AdminLyrics';

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
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setMessage(''); // Clear any error messages on successful login
        } else {
            setMessage('❌ Invalid password');
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

            {/* Tab Content - Much cleaner! */}
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
