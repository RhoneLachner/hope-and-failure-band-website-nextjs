import React from 'react';
import '../../styles/ResponsiveLogo.sass';

const ResponsiveLogo: React.FC = () => {
    return (
        <div className="responsive-logo">
            <img
                className="logo-horizontal"
                src="/assets/images/HopeFailure BlockLogo - Vector - White - Horizontal.png"
                alt="Hope & Failure Logo"
            />
            <img
                className="logo-vertical"
                src="/assets/images/HopeFailure BlockLogo - Vector - White - Vertical.png"
                alt="Hope & Failure Logo"
            />
        </div>
    );
};

export default ResponsiveLogo;
