'use client';

import React, { useState } from 'react';
import ContentBlockDark from '../../components/ui/ContentBlockDark';
import ShopItemModal from '../../components/forms/ShopItemModal';

interface ShopItem {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    sizes?: string[];
}

export default function ShopPage() {
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Shop items data
    const shopItems: ShopItem[] = [
        {
            id: 'judith-shirt',
            title: 'HOPE & FAILURE\nJUDITH PRINT SHIRT',
            description:
                'High-quality cotton t-shirt featuring the haunting Judith print design. Soft, comfortable fit with the ethereal aesthetic that defines Hope & Failure.',
            price: 25,
            images: [
                '/assets/images/Hope-Failure-Judith-Shirt.webp',
                '/assets/images/Hope-Failure-Judith-Shirt-Print.webp',
                '/assets/images/Hope-Failure-Shirt-Size-Chart.webp',
            ],
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        },
        {
            id: 'judith-tote',
            title: 'HOPE & FAILURE\nJUDITH PRINT TOTE',
            description:
                'Durable canvas tote bag featuring the iconic Judith print. Perfect for carrying your essentials while representing the Hope & Failure aesthetic.',
            price: 20,
            images: [
                '/assets/images/Hope-Failure-Judith-Tote.webp',
                '/assets/images/Hope-Failure-Judith-Tote-Print.webp',
            ],
        },
    ];

    const openModal = (item: ShopItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <>
            <div
                className="container"
                style={{
                    marginTop: '0rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <section className="shop-section" style={{ margin: '2rem' }}>
                    <ContentBlockDark
                        className="shop-main-content-block"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            paddingTop: '3rem',
                            paddingBottom: '4rem',
                        }}
                    >
                        <h1 style={{ marginBottom: '2rem' }}>Merch</h1>

                        <ContentBlockDark
                            className="inner-content-block"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '1.5rem',
                                margin: '0 auto',
                                width: '90%',
                                maxWidth: '800px',
                                borderRadius: '3px',
                            }}
                        >
                            <div
                                className="merch-section-border"
                                style={{
                                    width: '100%',
                                    padding: '4rem 1rem',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    borderRadius: '3px',
                                }}
                            >
                                <div
                                    className="merch-item-grid"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly',
                                        flexWrap: 'wrap',
                                        paddingTop: '12px',
                                        gap: 'clamp(2rem, 8vw, 8rem)',
                                    }}
                                >
                                    {shopItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="merch-item-container"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div
                                                className="merch-item-image-link"
                                                onClick={() => openModal(item)}
                                                style={{
                                                    maxHeight: '14rem',
                                                    width: 'auto',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <img
                                                    style={{
                                                        maxHeight: '14rem',
                                                        width: 'auto',
                                                        transition:
                                                            'transform 0.2s ease',
                                                    }}
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform =
                                                            'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform =
                                                            'scale(1)';
                                                    }}
                                                />
                                            </div>
                                            <h4
                                                className="merch-item-title-link"
                                                onClick={() => openModal(item)}
                                                style={{
                                                    paddingTop: '16px',
                                                    cursor: 'pointer',
                                                    transition:
                                                        'opacity 0.2s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.opacity =
                                                        '0.7';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.opacity =
                                                        '1';
                                                }}
                                            >
                                                {item.title
                                                    .split('\n')
                                                    .map((line, index) => (
                                                        <React.Fragment
                                                            key={index}
                                                        >
                                                            {line}
                                                            {index <
                                                                item.title.split(
                                                                    '\n'
                                                                ).length -
                                                                    1 && <br />}
                                                        </React.Fragment>
                                                    ))}
                                            </h4>
                                            <h5
                                                style={{ margin: '0' }}
                                                className="merch-item-price"
                                            >
                                                ${item.price} (shipping
                                                included)
                                            </h5>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ContentBlockDark>
                    </ContentBlockDark>
                </section>
            </div>

            {/* Modal */}
            <ShopItemModal
                item={selectedItem}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>
    );
}
