'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import '../../styles/header.sass';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header>
            <div className="container">
                <div className="header-content">
                    {/* Hamburger Menu Button - Mobile Only */}
                    <button
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* Navigation */}
                    <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                        <Link href="/" onClick={closeMenu}>
                            Home
                        </Link>
                        <Link href="/bio" onClick={closeMenu}>
                            Bio
                        </Link>
                        <Link href="/music" onClick={closeMenu}>
                            Music
                        </Link>
                        <Link href="/video" onClick={closeMenu}>
                            Video
                        </Link>
                        <Link href="/lyrics" onClick={closeMenu}>
                            Lyrics
                        </Link>
                        <Link href="/shop" onClick={closeMenu}>
                            Shop
                        </Link>
                        <Link href="/contact" onClick={closeMenu}>
                            Contact
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
