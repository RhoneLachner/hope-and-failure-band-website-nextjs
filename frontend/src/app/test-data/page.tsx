'use client';

import React, { useState, useEffect } from 'react';
import { useEvents } from '../../context/EventsContext';
import { useVideos } from '../../context/VideosContext';
import { useBio } from '../../context/BioContext';
import { useLyrics } from '../../context/LyricsContext';

export default function TestDataPage() {
    const [mounted, setMounted] = useState(false);
    const { events, loading: eventsLoading, error: eventsError } = useEvents();
    const { videos, loading: videosLoading, error: videosError } = useVideos();
    const { bio, loading: bioLoading, error: bioError } = useBio();
    const { lyrics, loading: lyricsLoading, error: lyricsError } = useLyrics();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div
            style={{
                padding: '2rem',
                color: '#fff',
                backgroundColor: '#000',
                minHeight: '100vh',
            }}
        >
            <h1>Database Data Test Page</h1>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Events ({events.length})</h2>
                {eventsLoading && <p>Loading events...</p>}
                {eventsError && (
                    <p style={{ color: 'red' }}>Error: {eventsError}</p>
                )}
                {events.length > 0 && (
                    <ul>
                        {events.slice(0, 3).map((event) => (
                            <li key={event.id}>
                                {event.title} - {event.date}
                            </li>
                        ))}
                        {events.length > 3 && (
                            <li>... and {events.length - 3} more</li>
                        )}
                    </ul>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Videos ({videos.length})</h2>
                {videosLoading && <p>Loading videos...</p>}
                {videosError && (
                    <p style={{ color: 'red' }}>Error: {videosError}</p>
                )}
                {videos.length > 0 && (
                    <ul>
                        {videos.slice(0, 3).map((video) => (
                            <li key={video.id}>{video.title}</li>
                        ))}
                        {videos.length > 3 && (
                            <li>... and {videos.length - 3} more</li>
                        )}
                    </ul>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Bio</h2>
                {bioLoading && <p>Loading bio...</p>}
                {bioError && <p style={{ color: 'red' }}>Error: {bioError}</p>}
                {bio && (
                    <div>
                        <p>Main text sections: {bio.mainText?.length || 0}</p>
                        <p>Past members: {bio.pastMembers?.length || 0}</p>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Lyrics ({lyrics.length})</h2>
                {lyricsLoading && <p>Loading lyrics...</p>}
                {lyricsError && (
                    <p style={{ color: 'red' }}>Error: {lyricsError}</p>
                )}
                {lyrics.length > 0 && (
                    <ul>
                        {lyrics.slice(0, 3).map((song) => (
                            <li key={song.id}>
                                {song.title}{' '}
                                {song.isInstrumental ? '(Instrumental)' : ''}
                            </li>
                        ))}
                        {lyrics.length > 3 && (
                            <li>... and {lyrics.length - 3} more</li>
                        )}
                    </ul>
                )}
            </div>

            <div
                style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#333',
                }}
            >
                <h3>Debug Info</h3>
                <p>
                    Current URL:{' '}
                    {mounted ? window.location.href : 'Loading...'}
                </p>
                <p>Events loaded: {events.length > 0 ? '✅' : '❌'}</p>
                <p>Videos loaded: {videos.length > 0 ? '✅' : '❌'}</p>
                <p>Bio loaded: {bio ? '✅' : '❌'}</p>
                <p>Lyrics loaded: {lyrics.length > 0 ? '✅' : '❌'}</p>
            </div>
        </div>
    );
}
