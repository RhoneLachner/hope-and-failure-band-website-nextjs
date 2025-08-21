import React from 'react';

interface ContentBlockProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const ContentBlockDark: React.FC<ContentBlockProps> = ({
    children,
    className = '',
    style = {},
}) => {
    return (
        <div
            className={`content-block ${className}`}
            style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(1px)',
                borderRadius: '0px',
                padding: '1.5rem',
                margin: '2rem 0',
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default ContentBlockDark;
