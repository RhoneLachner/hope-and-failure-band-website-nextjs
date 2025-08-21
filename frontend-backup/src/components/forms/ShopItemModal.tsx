import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { cartAPI } from '../../services/cart';

interface ShopItem {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    sizes?: string[];
}

interface ShopItemModalProps {
    item: ShopItem | null;
    isOpen: boolean;
    onClose: () => void;
}

const ShopItemModal: React.FC<ShopItemModalProps> = ({
    item,
    isOpen,
    onClose,
}) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
    const { addToCart, isLoading } = useCart();

    // Refs for focus management
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const addToCartButtonRef = useRef<HTMLButtonElement>(null);

    // Focus management
    useEffect(() => {
        if (isOpen && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [isOpen]);

    // Load stock levels when modal opens
    useEffect(() => {
        if (isOpen && item) {
            const loadStockLevels = async () => {
                try {
                    const inventoryStatus = await cartAPI.getInventoryStatus();
                    if (inventoryStatus[item.id]) {
                        setStockLevels(inventoryStatus[item.id]);
                    }
                } catch (error) {
                    console.error('Failed to load stock levels:', error);
                }
            };
            loadStockLevels();
        }
    }, [isOpen, item]);

    // Auto-switch to available size if current selection is out of stock
    useEffect(() => {
        if (item?.sizes && stockLevels[selectedSize] === 0) {
            // Find first available size
            const availableSize = item.sizes.find(
                (size) => stockLevels[size] > 0
            );
            if (availableSize) {
                setSelectedSize(availableSize);
            }
        }
    }, [stockLevels, selectedSize, item]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'Tab':
                    // Handle tab navigation within modal
                    break;
                case 'ArrowLeft':
                    if (item && item.images.length > 1) {
                        e.preventDefault();
                        setSelectedImageIndex((prev) =>
                            prev === 0 ? item.images.length - 1 : prev - 1
                        );
                    }
                    break;
                case 'ArrowRight':
                    if (item && item.images.length > 1) {
                        e.preventDefault();
                        setSelectedImageIndex((prev) =>
                            prev === item.images.length - 1 ? 0 : prev + 1
                        );
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, item, onClose]);

    if (!isOpen || !item) return null;

    const handleAddToCart = async () => {
        const success = await addToCart({
            id: item.id,
            title: item.title,
            price: item.price,
            size: item.sizes ? selectedSize : undefined,
            image: item.images[0],
        });

        if (success) {
            // Announce to screen readers
            const announcement = `Added ${item.title} ${
                item.sizes ? `(${selectedSize})` : ''
            } to cart for $${item.price}`;
            console.log(announcement);

            // Create live region announcement
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.textContent = announcement;
            document.body.appendChild(liveRegion);

            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (document.body.contains(liveRegion)) {
                        document.body.removeChild(liveRegion);
                    }
                }, 1000);
            });

            // Refresh stock levels after adding to cart
            const refreshStock = async () => {
                try {
                    const inventoryStatus = await cartAPI.getInventoryStatus();
                    if (inventoryStatus[item.id]) {
                        setStockLevels(inventoryStatus[item.id]);
                    }
                } catch (error) {
                    console.error('Failed to refresh stock levels:', error);
                }
            };
            refreshStock();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleModalClick = () => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="modal-content"
                onClick={handleModalClick}
                style={{
                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    maxWidth: '1200px',
                    width: '95%',
                    minHeight: '75vh',
                    maxHeight: '95vh',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '2rem',
                    padding: '2rem',
                    position: 'relative',
                }}
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    aria-label={`Close ${item.title} details dialog`}
                    title="Close dialog (Escape)"
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: '1px solid #fff',
                        borderRadius: '0',
                        color: '#fff',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        zIndex: 1001,
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px',
                        paddingBottom: '16px',
                    }}
                >
                    ×
                </button>

                {/* Images Section */}
                <div
                    className="modal-image-section"
                    style={{ flex: '0 0 calc(55% - 1rem)', minWidth: '200px' }}
                >
                    {/* Main Image */}
                    <div
                        style={{
                            marginBottom: '1rem',
                            textAlign: 'center',
                            width: '100%',
                            margin: '0 auto 1rem auto',
                        }}
                    >
                        <img
                            src={item.images[selectedImageIndex]}
                            alt={item.title}
                            onClick={() => setIsImageExpanded(true)}
                            style={{
                                width: '100%',
                                maxHeight: '500px',
                                objectFit: 'contain',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        />
                    </div>

                    {/* Thumbnail Images */}
                    {item.images.length > 1 && (
                        <div
                            style={{
                                display: 'flex',
                                gap: '1.5rem',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                width: '100%',
                                margin: '0 auto',
                            }}
                        >
                            {item.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${item.title} ${index + 1}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        border:
                                            selectedImageIndex === index
                                                ? '2px solid #fff'
                                                : '2px solid transparent',
                                        opacity:
                                            selectedImageIndex === index
                                                ? 1
                                                : 0.7,
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div
                    className="modal-details-section"
                    style={{
                        flex: '0 0 calc(45% - 1rem)',
                        minWidth: '200px',
                        color: '#fff',
                    }}
                >
                    <h2
                        id="modal-title"
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '300',
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {item.title.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                {index < item.title.split('\n').length - 1 && (
                                    <br />
                                )}
                            </React.Fragment>
                        ))}
                    </h2>

                    <p
                        id="modal-description"
                        style={{
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            marginBottom: '2rem',
                            opacity: '0.8',
                        }}
                    >
                        {item.description}
                    </p>

                    {/* Size Selection */}
                    {item.sizes && (
                        <div style={{ marginBottom: '2rem' }}>
                            <label
                                htmlFor="size-selector"
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Size:
                            </label>
                            <div
                                style={{ position: 'relative', width: '132px' }}
                            >
                                <div
                                    id="size-selector"
                                    role="button"
                                    tabIndex={0}
                                    aria-haspopup="listbox"
                                    aria-expanded={isDropdownOpen}
                                    aria-label={`Select size, current size is ${selectedSize}`}
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' ||
                                            e.key === ' '
                                        ) {
                                            e.preventDefault();
                                            setIsDropdownOpen(!isDropdownOpen);
                                        }
                                    }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '4px',
                                        color: '#fff',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        userSelect: 'none',
                                    }}
                                >
                                    <span>{selectedSize}</span>
                                    <span
                                        style={{
                                            transform: isDropdownOpen
                                                ? 'rotate(180deg)'
                                                : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    >
                                        ▼
                                    </span>
                                </div>
                                {isDropdownOpen && (
                                    <div
                                        role="listbox"
                                        aria-label="Size options"
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background:
                                                'rgba(26, 26, 26, 0.95)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderTop: 'none',
                                            borderRadius: '0 0 4px 4px',
                                            zIndex: 1000,
                                            boxShadow:
                                                '0 4px 6px rgba(0, 0, 0, 0.3)',
                                        }}
                                    >
                                        {item.sizes.map((size) => (
                                            <div
                                                key={size}
                                                role="option"
                                                tabIndex={
                                                    stockLevels[size] === 0
                                                        ? -1
                                                        : 0
                                                }
                                                aria-selected={
                                                    selectedSize === size
                                                }
                                                aria-disabled={
                                                    stockLevels[size] === 0
                                                }
                                                onClick={() => {
                                                    if (
                                                        stockLevels[size] !== 0
                                                    ) {
                                                        setSelectedSize(size);
                                                        setIsDropdownOpen(
                                                            false
                                                        );
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (
                                                        (e.key === 'Enter' ||
                                                            e.key === ' ') &&
                                                        stockLevels[size] !== 0
                                                    ) {
                                                        e.preventDefault();
                                                        setSelectedSize(size);
                                                        setIsDropdownOpen(
                                                            false
                                                        );
                                                    }
                                                }}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    color:
                                                        stockLevels[size] === 0
                                                            ? '#666'
                                                            : '#fff',
                                                    cursor:
                                                        stockLevels[size] === 0
                                                            ? 'not-allowed'
                                                            : 'pointer',
                                                    fontSize: '0.9rem',
                                                    backgroundColor:
                                                        selectedSize === size
                                                            ? 'rgba(255, 255, 255, 0.1)'
                                                            : 'transparent',
                                                    transition:
                                                        'background-color 0.1s ease',
                                                    opacity:
                                                        stockLevels[size] === 0
                                                            ? 0.5
                                                            : 1,
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (
                                                        selectedSize !== size &&
                                                        stockLevels[size] !== 0
                                                    ) {
                                                        e.currentTarget.style.backgroundColor =
                                                            'rgba(255, 255, 255, 0.05)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (
                                                        selectedSize !== size &&
                                                        stockLevels[size] !== 0
                                                    ) {
                                                        e.currentTarget.style.backgroundColor =
                                                            'transparent';
                                                    }
                                                }}
                                            >
                                                <span>{size}</span>
                                                {stockLevels[size] !==
                                                    undefined && (
                                                    <span
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            opacity: 0.7,
                                                            marginLeft:
                                                                '0.5rem',
                                                            fontStyle: 'italic',
                                                            color:
                                                                stockLevels[
                                                                    size
                                                                ] === 0
                                                                    ? '#ff6b6b'
                                                                    : stockLevels[
                                                                          size
                                                                      ] <= 3
                                                                    ? '#ffa726'
                                                                    : '#9e9e9e',
                                                        }}
                                                    >
                                                        ({stockLevels[size]}{' '}
                                                        left)
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                        ref={addToCartButtonRef}
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                        disabled={
                            isLoading ||
                            (item.sizes
                                ? stockLevels[selectedSize] === 0
                                : stockLevels.default === 0)
                        }
                        aria-label={`Add ${item.title} ${
                            item.sizes ? `in size ${selectedSize}` : ''
                        } to cart for $${item.price}`}
                        style={{
                            background: 'none',
                            border: '1px solid #fff',
                            color: '#fff',
                            padding: '1rem 2rem',
                            marginTop: '2rem',
                            fontSize: '0.9rem',
                            fontWeight: '300',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            cursor:
                                isLoading ||
                                (item.sizes
                                    ? stockLevels[selectedSize] === 0
                                    : stockLevels.default === 0)
                                    ? 'not-allowed'
                                    : 'pointer',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            opacity:
                                isLoading ||
                                (item.sizes
                                    ? stockLevels[selectedSize] === 0
                                    : stockLevels.default === 0)
                                    ? 0.6
                                    : 1,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                                'transparent';
                        }}
                    >
                        {isLoading
                            ? 'ADDING...'
                            : (
                                  item.sizes
                                      ? stockLevels[selectedSize] === 0
                                      : stockLevels.default === 0
                              )
                            ? 'OUT OF STOCK'
                            : `ADD TO CART: $${item.price}`}
                    </button>

                    {/* Stock Info for Non-Sized Items (Totes) */}
                    {!item.sizes && stockLevels.default !== undefined && (
                        <div
                            style={{
                                marginTop: '1rem',
                                fontSize: '0.85rem',
                                textAlign: 'center',
                                opacity: 0.8,
                            }}
                        >
                            <span
                                style={{
                                    color:
                                        stockLevels.default === 0
                                            ? '#ff6b6b'
                                            : stockLevels.default <= 5
                                            ? '#ffa726'
                                            : '#9e9e9e',
                                }}
                            >
                                {stockLevels.default === 0
                                    ? 'Out of Stock'
                                    : `${stockLevels.default} in stock`}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Image Overlay */}
            {isImageExpanded && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2000,
                        padding: '2rem',
                    }}
                    onClick={() => setIsImageExpanded(false)}
                >
                    {/* Close Button for Expanded View */}
                    <button
                        onClick={() => setIsImageExpanded(false)}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            background: 'none',
                            border: '1px solid #fff',
                            borderRadius: '0',
                            color: '#fff',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            zIndex: 2001,
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px',
                            paddingBottom: '16px',
                        }}
                    >
                        ×
                    </button>

                    {/* Expanded Image */}
                    <img
                        src={item.images[selectedImageIndex]}
                        alt={item.title}
                        style={{
                            maxWidth: 'calc(100vw - 4rem)',
                            maxHeight: 'calc(100vh - 4rem)',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            borderRadius: '4px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Modal Styles */}
            <style>
                {`
                    @media (max-width: 649px) {
                        .modal-content {
                            flex-direction: column !important;
                            gap: 1rem !important;
                            padding: 3rem !important;
                        }
                        .modal-image-section,
                        .modal-details-section {
                            flex: 1 1 100% !important;
                            padding-top: 2rem !important;
                        }
                        .add-to-cart-button {
                            margin-bottom: 5rem !important;
                        }
                    }

                    @media (min-width: 650px) and (max-width: 768px) {
                        .modal-content {
                            gap: 1.5rem !important;
                            padding: 1.5rem !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default ShopItemModal;
