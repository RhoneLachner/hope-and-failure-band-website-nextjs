import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cancel: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect back to cart after 3 seconds
        const timer = setTimeout(() => {
            navigate('/shop');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div
            style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <h1
                style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    fontWeight: '300',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}
            >
                Order Cancelled
            </h1>

            <p
                style={{
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    maxWidth: '600px',
                    lineHeight: '1.6',
                }}
            >
                Your order was cancelled and no payment was processed. If you
                experienced any issues, please try again or contact us for
                assistance.
            </p>

            <p
                style={{
                    fontSize: '0.9rem',
                    color: '#aaa',
                }}
            >
                Returning to shop in a few seconds...
            </p>
        </div>
    );
};

export default Cancel;
