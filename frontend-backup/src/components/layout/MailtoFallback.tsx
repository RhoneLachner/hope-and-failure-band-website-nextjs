import React from 'react';

interface MailtoFallbackProps {
    name: string;
    email: string;
    message: string;
}

const MailtoFallback: React.FC<MailtoFallbackProps> = ({
    name,
    email,
    message,
}) => {
    const subject = encodeURIComponent(
        'Contact Form Submission - Hope & Failure Website'
    );
    const body = encodeURIComponent(`
Name: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from the Hope & Failure website contact form.
    `);

    const mailtoLink = `mailto:hope.failure.pdx@gmail.com?subject=${subject}&body=${body}`;

    return (
        <div
            style={{
                background: 'rgba(255, 255, 0, 0.1)',
                border: '1px solid rgba(255, 255, 0, 0.3)',
                color: '#ffff00',
                padding: '1rem',
                borderRadius: '3px',
                textAlign: 'center',
                marginBottom: '1rem',
            }}
        >
            <p style={{ marginBottom: '1rem' }}>
                Email service is not configured. Click the button below to send
                your message via your default email client:
            </p>
            <a
                href={mailtoLink}
                style={{
                    display: 'inline-block',
                    background: 'transparent',
                    border: '1px solid #ffff00',
                    color: '#ffff00',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: '300',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderRadius: '0px',
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#ffff00';
                    e.currentTarget.style.color = '#000';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ffff00';
                }}
            >
                Open Email Client
            </a>
        </div>
    );
};

export default MailtoFallback;
