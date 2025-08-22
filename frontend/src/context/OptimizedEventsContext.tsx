'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    memo,
} from 'react';
import type { ReactNode } from 'react';
import { getAdminPassword } from '../config/auth';
import {
    useOptimizedFetch,
    usePerformanceMonitor,
} from '../utils/performanceHooks';

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
    // Performance-related data
    eventsCount: number;
    upcomingEvents: Event[];
    pastEvents: Event[];
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

const ADMIN_PASSWORD = getAdminPassword();

// PERFORMANCE: Memoized Events Provider
const EventsProvider: React.FC<EventsProviderProps> = memo(({ children }) => {
    // Performance monitoring
    usePerformanceMonitor('EventsProvider');

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // PERFORMANCE: Optimized fetch with caching
    const {
        data: fetchedEvents,
        loading: fetchLoading,
        error: fetchError,
        refetch,
    } = useOptimizedFetch<{ success: boolean; events: Event[] }>('/api/events');

    // Sync fetched data with local state
    useEffect(() => {
        if (fetchedEvents?.success && fetchedEvents.events) {
            setEvents(fetchedEvents.events);
        }
        setLoading(fetchLoading);
        setError(fetchError);
    }, [fetchedEvents, fetchLoading, fetchError]);

    // PERFORMANCE: Memoized computed values
    const memoizedValues = useMemo(() => {
        const now = new Date();
        const upcoming = events.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= now;
        });
        const past = events.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate < now;
        });

        return {
            eventsCount: events.length,
            upcomingEvents: upcoming.sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
            pastEvents: past.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
        };
    }, [events]);

    // PERFORMANCE: Memoized fetch function
    const fetchEvents = useCallback(async () => {
        await refetch();
    }, [refetch]);

    // PERFORMANCE: Memoized CRUD operations
    const addEvent = useCallback(
        async (eventData: Omit<Event, 'id' | 'isPast'>): Promise<boolean> => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/admin/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...eventData,
                        password: ADMIN_PASSWORD,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    // PERFORMANCE: Optimistic update
                    const newEvent: Event = {
                        ...eventData,
                        id: result.event?.id || Date.now().toString(),
                        isPast: new Date(eventData.date) < new Date(),
                    };
                    setEvents((prev) => [...prev, newEvent]);
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to add event');
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Failed to add event';
                setError(errorMessage);
                console.error('Add event error:', err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const updateEvent = useCallback(
        async (id: string, eventData: Partial<Event>): Promise<boolean> => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/admin/events/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...eventData,
                        password: ADMIN_PASSWORD,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    // PERFORMANCE: Optimistic update
                    setEvents((prev) =>
                        prev.map((event) =>
                            event.id === id
                                ? {
                                      ...event,
                                      ...eventData,
                                      isPast: eventData.date
                                          ? new Date(eventData.date) <
                                            new Date()
                                          : event.isPast,
                                  }
                                : event
                        )
                    );
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to update event');
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Failed to update event';
                setError(errorMessage);
                console.error('Update event error:', err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

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
                // PERFORMANCE: Optimistic update
                setEvents((prev) => prev.filter((event) => event.id !== id));
                return true;
            } else {
                throw new Error(result.error || 'Failed to delete event');
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to delete event';
            setError(errorMessage);
            console.error('Delete event error:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // PERFORMANCE: Memoized context value
    const contextValue = useMemo(
        () => ({
            events,
            loading,
            error,
            fetchEvents,
            addEvent,
            updateEvent,
            deleteEvent,
            clearError,
            ...memoizedValues,
        }),
        [
            events,
            loading,
            error,
            fetchEvents,
            addEvent,
            updateEvent,
            deleteEvent,
            clearError,
            memoizedValues,
        ]
    );

    return (
        <EventsContext.Provider value={contextValue}>
            {children}
        </EventsContext.Provider>
    );
});

EventsProvider.displayName = 'EventsProvider';

export { EventsProvider };
