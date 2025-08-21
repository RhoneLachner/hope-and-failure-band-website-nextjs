import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
                        <Link to="/" onClick={closeMenu}>
                            Home
                        </Link>
                        <Link to="/bio" onClick={closeMenu}>
                            Bio
                        </Link>
                        <Link to="/music" onClick={closeMenu}>
                            Music
                        </Link>
                        <Link to="/video" onClick={closeMenu}>
                            Video
                        </Link>
                        <Link to="/lyrics" onClick={closeMenu}>
                            Lyrics
                        </Link>
                        <Link to="/shop" onClick={closeMenu}>
                            Shop
                        </Link>
                        <Link to="/contact" onClick={closeMenu}>
                            Contact
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
