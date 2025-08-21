import React from 'react';
import ContentBlock from '../components/ui/ContentBlock';
import ContentBlockDark from '../components/ui/ContentBlockDark';
import ContentBlockDarkest from '../components/ui/ContentBlockDarkest';
import ResponsiveLogo from '../components/ui/ResponsiveLogo';
import EventsCalendar from '../components/layout/EventsCalendar';

const Home = () => {
    return (
        <div className="container">
            <ContentBlockDarkest style={{ marginTop: '4rem' }}>
                <section className="hero section text-center">
                    <div
                        className="hero-mobile"
                        style={{ marginTop: '5rem', marginBottom: '5rem' }}
                    >
                        <ResponsiveLogo />
                    </div>
                </section>
            </ContentBlockDarkest>
            <ContentBlock>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginBottom: '2rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <a
                        href="/shop"
                        style={{
                            fontSize: '.9rem',
                            fontWeight: '300',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginTop: '15px',
                            padding: '1.25rem 2rem',
                            border: '1px solid rgb(255, 255, 255)',
                            transition: 'all 0.1s ease',
                        }}
                    >
                        Merch
                    </a>
                </div>
                <section>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem',
                            marginTop: '3rem',
                        }}
                    >
                        <a
                            href="https://instagram.com/hopeandfailure"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <img
                                src="/assets/icons/ICON-insta2.png"
                                alt="Instagram"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                }}
                            />
                        </a>
                        <a
                            href="https://hopeandfailure.bandcamp.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <img
                                src="/assets/icons/ICON-bandcamp2.png"
                                alt="Bandcamp"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                }}
                            />
                        </a>
                        <a
                            href="https://linktr.ee/hopeandfailure"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <img
                                src="/assets/icons/ICON-linktree2.png"
                                alt="Linktree"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                }}
                            />
                        </a>
                    </div>
                </section>
            </ContentBlock>

            <ContentBlockDark style={{ padding: '3.5rem' }}>
                <EventsCalendar showUpcoming={true} showPast={true} />
            </ContentBlockDark>
        </div>
    );
};

export default Home;
