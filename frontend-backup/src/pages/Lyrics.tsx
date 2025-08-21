import React from 'react';
import ContentBlockDark from '../components/ui/ContentBlockDark';
import { useLyrics } from '../context/LyricsContext';

const Lyrics = () => {
    const { lyrics, loading, error } = useLyrics();

    if (loading) {
        return (
            <div
                className="container"
                style={{ marginTop: '4rem', textAlign: 'center' }}
            >
                <ContentBlockDark>
                    <div style={{ padding: '2rem' }}>Loading lyrics...</div>
                </ContentBlockDark>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="container"
                style={{ marginTop: '4rem', textAlign: 'center' }}
            >
                <ContentBlockDark>
                    <div style={{ padding: '2rem', color: '#f44336' }}>
                        Error loading lyrics: {error}
                    </div>
                </ContentBlockDark>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '4rem' }}>
            <ContentBlockDark>
                <section className="section lyrics-section">
                    <h1
                        className="text-center"
                        style={{ marginBottom: '0rem' }}
                    >
                        Lyrics
                    </h1>
                    <div
                        style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0',
                        }}
                    >
                        {lyrics.length === 0 ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    opacity: 0.7,
                                    fontStyle: 'italic',
                                }}
                            >
                                No lyrics available yet.
                            </div>
                        ) : (
                            lyrics.map((song) => (
                                <ContentBlockDark
                                    key={song.id}
                                    className="inner-content-block"
                                >
                                    <div
                                        style={{
                                            padding: '2rem',
                                            border: '1px solid rgba(255,255,255,0.18)',
                                            borderRadius: '3px',
                                        }}
                                    >
                                        <h3
                                            style={{
                                                marginBottom: '1.5rem',
                                                textAlign: 'left',
                                                fontSize: '1.4rem',
                                                fontWeight: '300',
                                                letterSpacing: '0.1em',
                                            }}
                                        >
                                            {song.title}
                                        </h3>
                                        {song.isInstrumental ? (
                                            <p
                                                style={{
                                                    textAlign: 'left',
                                                    fontStyle: 'italic',
                                                    opacity: '0.8',
                                                }}
                                            >
                                                (instrumental)
                                            </p>
                                        ) : (
                                            <p
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                {song.lyrics}
                                            </p>
                                        )}
                                    </div>
                                </ContentBlockDark>
                            ))
                        )}
                    </div>
                </section>
            </ContentBlockDark>
        </div>
    );
};

export default Lyrics;
