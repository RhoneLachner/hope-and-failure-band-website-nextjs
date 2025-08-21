// Shared data model types

export interface InventoryItem {
    id: string;
    title: string;
    price: number;
    sizes?: string[];
    inventory: Record<string, number>;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    time?: string;
    venue: string;
    location: string;
    description?: string;
    ticketLink?: string;
    isPast: boolean;
}

export interface Video {
    id: string;
    youtubeId: string;
    title: string;
    description?: string;
    order: number;
}

export interface Song {
    id: string;
    title: string;
    lyrics: string;
    order: number;
    isInstrumental: boolean;
}

export interface Bio {
    mainText: string[];
    bandImage: string;
    pastMembers: string[];
    photography: PhotoCredit[];
}

export interface PhotoCredit {
    name: string;
    instagram: string;
    url: string;
}

export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    size?: string;
}

export interface OrderData {
    items: CartItem[];
    total: number;
    sessionId?: string;
    customerEmail?: string;
    shippingAddress?: any;
}
