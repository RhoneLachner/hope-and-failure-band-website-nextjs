'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import type { ReactNode } from 'react';

export interface Event {
    id: string;
    title: string;
    date: string;
    time?: string;
    venue: string;
    location: string;
    isPast?: boolean;
    description?: string;
    ticketLink?: string;
}

interface EventsContextType {
    events: Event[];
    loading: boolean;
    error: string | null;
    fetchEvents: () => Promise<void>;
    addEvent: (eventData: Omit<Event, 'id' | 'isPast'>) => Promise<boolean>;
    updateEvent: (id: string, eventData: Partial<Event>) => Promise<boolean>;
    deleteEvent: (id: string) => Promise<boolean>;
    clearError: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};

interface EventsProviderProps {
    children: ReactNode;
}

const ADMIN_PASSWORD = 'admin123'; // Same as inventory admin

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/events');
            const result = await response.json();

            if (result.success) {
                setEvents(result.events);
                console.log(
                    '📅 Events fetched successfully:',
                    result.events.length
                );
            } else {
                throw new Error(result.error || 'Failed to fetch events');
            }
        } catch (error) {
            console.error('❌ Error fetching events:', error);
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    }, []);

    const addEvent = useCallback(
        async (eventData: Omit<Event, 'id' | 'isPast'>): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/admin/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: ADMIN_PASSWORD,
                        ...eventData,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setEvents((prevEvents) => [result.event, ...prevEvents]);
                    console.log(
                        '✅ Event added successfully:',
                        result.event.title
                    );
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to add event');
                }
            } catch (error) {
                console.error('❌ Error adding event:', error);
                setError('Failed to add event');
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const updateEvent = useCallback(
        async (id: string, eventData: Partial<Event>): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/admin/events/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: ADMIN_PASSWORD,
                        ...eventData,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setEvents((prevEvents) =>
                        prevEvents.map((event) =>
                            event.id === id ? result.event : event
                        )
                    );
                    console.log(
                        '✅ Event updated successfully:',
                        result.event.title
                    );
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to update event');
                }
            } catch (error) {
                console.error('❌ Error updating event:', error);
                setError('Failed to update event');
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: ADMIN_PASSWORD,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event.id !== id)
                );
                console.log(
                    '✅ Event deleted successfully:',
                    result.deletedEvent.title
                );
                return true;
            } else {
                throw new Error(result.error || 'Failed to delete event');
            }
        } catch (error) {
            console.error('❌ Error deleting event:', error);
            setError('Failed to delete event');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Load events on mount (client-side only)
    useEffect(() => {
        // Only fetch on client-side to avoid SSR issues
        if (typeof window !== 'undefined') {
            console.log(
                '🔄 EventsProvider useEffect triggered - calling fetchEvents'
            );
            console.log('🌐 Current window location:', window.location.href);
            fetchEvents();
        }
    }, [fetchEvents]);

    const value: EventsContextType = {
        events,
        loading,
        error,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        clearError,
    };

    return (
        <EventsContext.Provider value={value}>
            {children}
        </EventsContext.Provider>
    );
};

export default EventsContext;
