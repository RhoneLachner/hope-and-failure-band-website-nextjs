import React, { useState, useEffect } from 'react';
import AdminMessage from './AdminMessage';

interface InventoryItem {
    id: string;
    title: string;
    price: number;
    sizes?: string[];
    inventory: Record<string, number>;
}

interface AdminInventoryProps {
    password: string;
    setMessage: (message: string) => void;
    message: string;
}

const AdminInventory: React.FC<AdminInventoryProps> = ({
    password,
    setMessage,
    message,
}) => {
    const [inventory, setInventory] = useState<Record<string, InventoryItem>>(
        {}
    );
    const [loading, setLoading] = useState(false);
    const [changedInputs, setChangedInputs] = useState<Set<string>>(new Set());

    const loadInventory = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/inventory');
            const result = await response.json();
            if (result.success) {
                setInventory(result.inventory);
            }
        } catch (error) {
            console.error('Failed to load inventory:', error);
        }
    };

    useEffect(() => {
        loadInventory();
    }, []);

    const updateInventory = async (
        itemId: string,
        size: string | null,
        newQuantity: number
    ) => {
        setLoading(true);
        try {
            const response = await fetch(
                'http://localhost:3000/api/admin/inventory',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        itemId,
                        size,
                        newQuantity,
                        adminPassword: password,
                    }),
                }
            );

            const result = await response.json();
            if (result.success) {
                setMessage(`✅ ${result.message}`);
                // Clear the glow state for this input
                const inputKey = `${itemId}-${size || 'one-size'}`;
                setChangedInputs((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(inputKey);
                    return newSet;
                });
                await loadInventory(); // Reload to show updated values
            } else {
                setMessage(`❌ ${result.error}`);
            }
        } catch (error) {
            setMessage(`❌ Network error: ${error}`);
        }
        setLoading(false);
    };

    return (
        <>
            <style>
                {`
                    @keyframes pulse {
                        0% { box-shadow: 0 0 15px rgba(76, 175, 80, 0.5); }
                        50% { box-shadow: 0 0 25px rgba(76, 175, 80, 0.8); }
                        100% { box-shadow: 0 0 15px rgba(76, 175, 80, 0.5); }
                    }
                `}
            </style>

            <h2
                style={{
                    marginBottom: '2rem',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}
            >
                Inventory Management
            </h2>

            <AdminMessage message={message} />

            {Object.entries(inventory).map(([itemId, item]) => (
                <div
                    key={itemId}
                    style={{
                        background: 'rgba(20, 20, 20, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '2rem',
                        marginBottom: '2rem',
                    }}
                >
                    <h2
                        style={{
                            marginBottom: '1rem',
                            fontSize: '1.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {item.title.replace('\n', ' ')}
                    </h2>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                        }}
                    >
                        {Object.entries(item.inventory).map(
                            ([size, quantity]) => (
                                <div
                                    key={`${itemId}-${size}`}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        padding: '1rem',
                                    }}
                                >
                                    <h3
                                        style={{
                                            marginBottom: '0.5rem',
                                            fontSize: '1rem',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {size === 'one-size'
                                            ? 'Tote Bag'
                                            : `Size ${size}`}
                                    </h3>

                                    <div
                                        style={{
                                            marginBottom: '1rem',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                color:
                                                    quantity === 0
                                                        ? '#f44336'
                                                        : quantity <= 3
                                                        ? '#ff9800'
                                                        : '#4CAF50',
                                                display: 'block',
                                                marginBottom: '1rem',
                                            }}
                                        >
                                            {quantity} in stock
                                        </span>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                width: '100%',
                                            }}
                                        >
                                            <input
                                                type="number"
                                                min="0"
                                                defaultValue={quantity}
                                                id={`${itemId}-${size}-input`}
                                                onChange={(e) => {
                                                    const inputKey = `${itemId}-${size}`;
                                                    const newValue =
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0;
                                                    if (newValue !== quantity) {
                                                        setChangedInputs(
                                                            (prev) =>
                                                                new Set(
                                                                    prev
                                                                ).add(inputKey)
                                                        );
                                                    } else {
                                                        setChangedInputs(
                                                            (prev) => {
                                                                const newSet =
                                                                    new Set(
                                                                        prev
                                                                    );
                                                                newSet.delete(
                                                                    inputKey
                                                                );
                                                                return newSet;
                                                            }
                                                        );
                                                    }
                                                }}
                                                style={{
                                                    flex: '1',
                                                    padding: '0.75rem',
                                                    background:
                                                        'rgba(255, 255, 255, 0.1)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    borderRadius: '4px',
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                    minWidth: '80px',
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const input =
                                                        document.getElementById(
                                                            `${itemId}-${size}-input`
                                                        ) as HTMLInputElement;
                                                    const newQuantity =
                                                        parseInt(input.value) ||
                                                        0;
                                                    updateInventory(
                                                        itemId,
                                                        size === 'one-size'
                                                            ? null
                                                            : size,
                                                        newQuantity
                                                    );
                                                }}
                                                disabled={loading}
                                                style={{
                                                    padding: '0.75rem 1.5rem',
                                                    background:
                                                        changedInputs.has(
                                                            `${itemId}-${size}`
                                                        )
                                                            ? 'rgba(76, 175, 80, 0.2)'
                                                            : 'none',
                                                    border: changedInputs.has(
                                                        `${itemId}-${size}`
                                                    )
                                                        ? '1px solid #4CAF50'
                                                        : '1px solid #4CAF50',
                                                    borderRadius: '4px',
                                                    color: '#4CAF50',
                                                    fontSize: '1rem',
                                                    cursor: loading
                                                        ? 'not-allowed'
                                                        : 'pointer',
                                                    opacity: loading ? 0.5 : 1,
                                                    whiteSpace: 'nowrap',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    textAlign: 'center',
                                                    boxShadow:
                                                        changedInputs.has(
                                                            `${itemId}-${size}`
                                                        )
                                                            ? '0 0 15px rgba(76, 175, 80, 0.5)'
                                                            : 'none',
                                                    animation:
                                                        changedInputs.has(
                                                            `${itemId}-${size}`
                                                        )
                                                            ? 'pulse 1.5s infinite'
                                                            : 'none',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!loading) {
                                                        e.currentTarget.style.backgroundColor =
                                                            changedInputs.has(
                                                                `${itemId}-${size}`
                                                            )
                                                                ? 'rgba(76, 175, 80, 0.3)'
                                                                : 'rgba(76, 175, 80, 0.1)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor =
                                                        changedInputs.has(
                                                            `${itemId}-${size}`
                                                        )
                                                            ? 'rgba(76, 175, 80, 0.2)'
                                                            : 'transparent';
                                                }}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default AdminInventory;
