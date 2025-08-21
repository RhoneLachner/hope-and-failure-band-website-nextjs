'use client';

import React from 'react';
import ContentBlockDark from '../../components/ui/ContentBlockDarkest';
import { useBio } from '../../context/BioContext';

export default function BioPage() {
    const { bio, loading, error } = useBio();

    if (loading) {
        return (
            <div
                className="container"
                style={{
                    marginTop: '4em',
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                }}
            >
                Loading bio...
            </div>
        );
    }

    if (error || !bio) {
        return (
            <div
                className="container"
                style={{
                    marginTop: '4em',
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f44336',
                }}
            >
                Error loading bio: {error || 'Bio not found'}
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '4em' }}>
            <ContentBlockDark className="bio-content-block">
                <section className="section">
                    <h1
                        className="text-center"
                        style={{ marginBottom: '2rem' }}
                    >
                        Bio
                    </h1>

                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '2.5rem',
                        }}
                    >
                        <img
                            src={bio.bandImage}
                            alt="Hope & Failure Band Photo"
                            className="bio-image"
                            style={{
                                maxWidth: '700px',
                                width: '70%',
                                height: 'auto',
                                borderRadius: '0px',
                            }}
                        />
                    </div>

                    <div
                        className="bio-text-content"
                        style={{ maxWidth: '800px', margin: '0 auto' }}
                    >
                        {bio.mainText.map((paragraph, index) => (
                            <p
                                key={index}
                                style={{
                                    fontWeight: index === 0 ? '100' : 'normal',
                                    fontSize: '.9rem',
                                    lineHeight: '1.8',
                                    marginBottom:
                                        index === bio.mainText.length - 1
                                            ? '3rem'
                                            : '2rem',
                                    textAlign: 'justify',
                                }}
                            >
                                {paragraph}
                            </p>
                        ))}

                        {bio.pastMembers && bio.pastMembers.length > 0 && (
                            <div
                                style={{
                                    borderTop:
                                        '1px solid rgba(255,255,255,0.2)',
                                    paddingTop: '2rem',
                                    marginBottom: '2rem',
                                }}
                            >
                                <h4
                                    style={{
                                        fontStyle: 'italic',
                                        opacity: '0.8',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    Past Members (current friends):
                                </h4>
                                {bio.pastMembers.map((member, index) => (
                                    <p
                                        key={index}
                                        style={{
                                            opacity: '0.7',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        {member}
                                    </p>
                                ))}
                            </div>
                        )}

                        {bio.photography && bio.photography.length > 0 && (
                            <div
                                style={{
                                    borderTop:
                                        '1px solid rgba(255,255,255,0.2)',
                                    paddingTop: '2rem',
                                }}
                            >
                                <h4
                                    style={{
                                        fontStyle: 'italic',
                                        opacity: '0.8',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    Photography:
                                </h4>
                                {bio.photography.map((photo, index) => (
                                    <p
                                        key={index}
                                        style={{
                                            opacity: '0.7',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        {photo.name} - IG:{' '}
                                        <a
                                            href={photo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: 'inherit' }}
                                        >
                                            {photo.instagram}
                                        </a>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </ContentBlockDark>
        </div>
    );
}