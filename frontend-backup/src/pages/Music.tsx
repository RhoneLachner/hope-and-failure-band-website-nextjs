import React, { useEffect, useRef } from 'react';
import ContentBlockDark from '../components/ui/ContentBlockDark';

const Music = () => {
    const audioRef1 = useRef<HTMLAudioElement>(null);
    const audioRef2 = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef1.current) audioRef1.current.volume = 0.8;
        if (audioRef2.current) audioRef2.current.volume = 0.8;
    }, []);
    return (
        <div className="container" style={{ marginTop: '4rem' }}>
            <ContentBlockDark>
                <section className="section">
                    <h1
                        className="text-center"
                        style={{ marginBottom: '1rem' }}
                    >
                        Music
                    </h1>
                    <div
                        style={{
                            maxWidth: '750px',
                            margin: '0 auto',
                            width: '90%',
                            marginBottom: '3rem',
                        }}
                    >
                        <ContentBlockDark className="inner-content-block">
                            <div
                                style={{
                                    padding: '2rem',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    borderRadius: '4px',
                                }}
                            >
                                <h3 style={{ marginBottom: '1rem' }}>
                                    Mirror Altar - Live Acoustic Set - July 2023
                                </h3>
                                <p
                                    style={{
                                        opacity: '0.7',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    Duration: 4:45
                                </p>
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '1rem',
                                        borderRadius: '3px',
                                    }}
                                >
                                    <audio
                                        ref={audioRef1}
                                        controls
                                        style={{
                                            width: '100%',
                                            background: 'rgba(0,0,0,0.3)',
                                            borderRadius: '3px',
                                        }}
                                        preload="metadata"
                                    >
                                        <source
                                            src="/assets/music/Mirror Altar.wav"
                                            type="audio/wav"
                                        />
                                        Your browser does not support the audio
                                        element.
                                    </audio>
                                </div>
                            </div>
                        </ContentBlockDark>
                        <ContentBlockDark className="inner-content-block">
                            <div
                                style={{
                                    padding: '2rem',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    borderRadius: '4px',
                                }}
                            >
                                <h3 style={{ marginBottom: '1rem' }}>
                                    Hell and Back - Live Acoustic Set - July
                                    2023
                                </h3>
                                <p
                                    style={{
                                        opacity: '0.7',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    Duration: 6:04
                                </p>
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '1rem',
                                        borderRadius: '3px',
                                    }}
                                >
                                    <audio
                                        ref={audioRef2}
                                        controls
                                        style={{
                                            width: '100%',
                                            background: 'rgba(0,0,0,0.3)',
                                            borderRadius: '3px',
                                        }}
                                        preload="metadata"
                                    >
                                        <source
                                            src="/assets/music/Hell and Back.wav"
                                            type="audio/wav"
                                        />
                                        Your browser does not support the audio
                                        element.
                                    </audio>
                                </div>
                            </div>
                        </ContentBlockDark>

                        <div
                            style={{
                                textAlign: 'center',
                                paddingTop: '1rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0px',
                                opacity: '0.6',
                            }}
                        >
                            <p>More music coming soon 🤍</p>
                        </div>
                    </div>
                </section>
            </ContentBlockDark>
        </div>
    );
};

export default Music;
