'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutCancelPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home after 5 seconds
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

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
                    color: '#FFA726',
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
                Your order has been cancelled. No payment was processed.
            </p>

            <p
                style={{
                    fontSize: '0.9rem',
                    color: '#aaa',
                    marginBottom: '2rem',
                }}
            >
                You&apos;ll be redirected to the home page in a few seconds...
            </p>

            <button
                onClick={() => router.push('/')}
                style={{
                    padding: '1rem 2rem',
                    border: '1px solid #fff',
                    color: '#fff',
                    background: 'transparent',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = '#000';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#fff';
                }}
            >
                Return to Home
            </button>
        </div>
    );
}
