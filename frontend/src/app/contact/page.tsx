'use client';

import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import ContentBlockDarkest from '../../components/ui/ContentBlockDarkest';
import MailtoFallback from '../../components/layout/MailtoFallback';
import { emailConfig } from '../../services/emailConfig';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'success' | 'error'
    >('idle');
    const [showFallback, setShowFallback] = useState(false);

    // Initialize EmailJS once on mount
    useEffect(() => {
        emailjs.init(emailConfig.publicKey);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setSubmitStatus('idle');
        setShowFallback(false);

        // Prepare a timestamp for your template
        const now = new Date().toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        try {
            await emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
                name: formData.name,
                email: formData.email, // if your template uses {{email}}
                time: now, // matches {{time}} in your template
                message: formData.message, // matches {{message}}
            });

            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('EmailJS error:', error);
            setSubmitStatus('error');
            setShowFallback(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '4rem' }}>
            <ContentBlockDarkest className="contact-content-block">
                <section className="section">
                    <h1
                        className="text-center"
                        style={{ marginBottom: '2rem' }}
                    >
                        Inquiries
                    </h1>

                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                            }}
                        >
                            {/* Name */}
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.25rem',
                                        fontWeight: '300',
                                        opacity: '0.8',
                                    }}
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="contact-name-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '.75rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '3px',
                                        color: '#fff',
                                        fontSize: '.8rem',
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.25rem',
                                        fontWeight: '300',
                                        opacity: '0.8',
                                    }}
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="contact-email-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '.75rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '3px',
                                        color: '#fff',
                                        fontSize: '.8rem',
                                    }}
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.25rem',
                                        fontWeight: '300',
                                        opacity: '0.8',
                                    }}
                                >
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    required
                                    style={{
                                        width: '100%',
                                        height: '20vh',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '3px',
                                        color: '#fff',
                                        fontSize: '.8rem',
                                        resize: 'vertical',
                                    }}
                                />
                            </div>

                            {/* Success Message */}
                            {submitStatus === 'success' && (
                                <div
                                    style={{
                                        background: 'rgba(0, 255, 0, 0.1)',
                                        border: '1px solid rgba(0, 255, 0, 0.3)',
                                        color: '#00ff00',
                                        padding: '1rem',
                                        borderRadius: '3px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Message sent successfully! We&apos;ll get
                                    back to you soon.
                                </div>
                            )}

                            {/* Error Message */}
                            {submitStatus === 'error' && (
                                <div
                                    style={{
                                        background: 'rgba(255, 0, 0, 0.1)',
                                        border: '1px solid rgba(255, 0, 0, 0.3)',
                                        color: '#ff6b6b',
                                        padding: '1rem',
                                        borderRadius: '3px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Failed to send message. Please try again or
                                    contact us directly at
                                    hope.failure.pdx@gmail.com
                                </div>
                            )}

                            {/* Fallback */}
                            {showFallback && (
                                <MailtoFallback
                                    name={formData.name}
                                    email={formData.email}
                                    message={formData.message}
                                />
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #fff',
                                    color: '#fff',
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    fontWeight: '300',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    cursor: isLoading
                                        ? 'not-allowed'
                                        : 'pointer',
                                    alignSelf: 'center',
                                    opacity: isLoading ? 0.6 : 1,
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                    if (!isLoading) {
                                        e.currentTarget.style.background =
                                            '#fff';
                                        e.currentTarget.style.color = '#000';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isLoading) {
                                        e.currentTarget.style.background =
                                            'transparent';
                                        e.currentTarget.style.color = '#fff';
                                    }
                                }}
                            >
                                {isLoading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>

                        <div
                            style={{
                                marginTop: '4rem',
                                textAlign: 'center',
                                padding: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                opacity: 0.7,
                            }}
                        >
                            <p
                                style={{
                                    marginBottom: '1rem',
                                    fontSize: '0.8rem',
                                }}
                            >
                                Please send us a message for booking inquiries,
                                collaborations, or general questions.
                            </p>
                            <p
                                style={{
                                    fontSize: '0.8rem',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                Follow us on social media for updates and
                                announcements
                            </p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                Direct email: hope.failure.pdx@gmail.com
                            </p>
                        </div>
                    </div>
                </section>
            </ContentBlockDarkest>
        </div>
    );
}
