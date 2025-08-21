import React from 'react';

interface AdminMessageProps {
    message: string;
    onClear?: () => void;
}

const AdminMessage: React.FC<AdminMessageProps> = ({ message, onClear }) => {
    if (!message) return null;

    const isSuccess = message.includes('✅');
    const isError = message.includes('❌');

    return (
        <div
            style={{
                background: isSuccess
                    ? 'rgba(76, 175, 80, 0.2)'
                    : isError
                    ? 'rgba(244, 67, 54, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${
                    isSuccess
                        ? '#4CAF50'
                        : isError
                        ? '#f44336'
                        : 'rgba(255, 255, 255, 0.3)'
                }`,
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'center',
                position: 'relative',
            }}
        >
            {message}
            {onClear && (
                <button
                    onClick={onClear}
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: '0.25rem',
                        opacity: 0.7,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.7';
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default AdminMessage;
