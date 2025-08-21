'use client';

import React from 'react';
import { useEvents } from '../../context/EventsContext';
import type { Event } from '../../context/EventsContext';

interface EventsCalendarProps {
    showUpcoming?: boolean;
    showPast?: boolean;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({
    showUpcoming = true,
    showPast = false,
}) => {
    const { events, loading, error } = useEvents();

    if (loading) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#fff',
                }}
            >
                Loading events...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#f44336',
                }}
            >
                Error loading events: {error}
            </div>
        );
    }

    // Convert date strings to Date objects for comparison, excluding existing events without proper dates
    const eventsWithDates = events.filter((event) => {
        try {
            // Handle both 'YYYY-MM-DD' and 'Month DD, YYYY' formats
            if (event.date.includes('-')) {
                return new Date(event.date);
            } else {
                return new Date(event.date);
            }
        } catch {
            return false;
        }
    });

    // Use the server events instead of hardcoded ones
    const sampleEvents: Event[] = eventsWithDates;

    const upcomingEvents = sampleEvents.filter((event) => !event.isPast);
    const pastEvents = sampleEvents.filter((event) => event.isPast);

    const formatTableDate = (dateString: string, timeString?: string) => {
        // Handle different date formats: YYYY-MM-DD or Month DD, YYYY
        let date: Date;
        if (dateString.includes('-')) {
            // YYYY-MM-DD format
            date = new Date(dateString);
        } else {
            // Month DD, YYYY format (existing format)
            date = new Date(dateString);
        }

        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthDay = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
        });
        const year = date.getFullYear();
        const timeDisplay = timeString ? ` @ ${timeString}` : '';

        return `${dayName}, ${monthDay}, ${year}${timeDisplay}`;
    };

    const EventTable: React.FC<{ events: Event[]; title: string }> = ({
        events,
        title,
    }) => (
        <div style={{ marginBottom: '3rem' }}>
            <h2
                className="events-calendar-title"
                style={{
                    color: '#fff',
                    fontSize: '1.2rem',
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '1.5rem',
                    marginTop: '4.5rem',
                    textAlign: 'left',
                }}
            >
                {title}
            </h2>

            <div
                className="events-calendar-table"
                style={{ overflowX: 'auto' }}
            >
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        color: '#fff',
                        fontSize: '0.9rem',
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                borderBottom:
                                    '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <th
                                className="events-date-column"
                                style={{
                                    textAlign: 'left',
                                    padding: '1rem 0',
                                    fontWeight: '400',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontSize: '0.8rem',
                                    opacity: '0.8',
                                    width: '25%',
                                }}
                            >
                                Date
                            </th>
                            <th
                                style={{
                                    textAlign: 'left',
                                    padding: '1rem 0',
                                    fontWeight: '400',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontSize: '0.8rem',
                                    opacity: '0.8',
                                    width: '50%',
                                }}
                            >
                                Event
                            </th>
                            <th
                                style={{
                                    textAlign: 'left',
                                    padding: '1rem 0',
                                    fontWeight: '400',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontSize: '0.8rem',
                                    opacity: '0.8',
                                    width: '25%',
                                }}
                            >
                                Location
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr
                                key={event.id}
                                style={{
                                    borderBottom:
                                        '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'background-color 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        'rgba(255, 255, 255, 0.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        'transparent';
                                }}
                            >
                                <td
                                    className="events-date-column"
                                    style={{
                                        padding: '1.25rem 0',
                                        verticalAlign: 'top',
                                        fontSize: '0.85rem',
                                        fontWeight: '300',
                                    }}
                                >
                                    {formatTableDate(event.date, event.time)}
                                </td>
                                <td
                                    style={{
                                        padding: '1.25rem 0',
                                        paddingRight: '1rem',
                                        verticalAlign: 'top',
                                        lineHeight: '1.4',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {event.title}
                                </td>
                                <td
                                    style={{
                                        padding: '1.25rem 0',
                                        verticalAlign: 'top',
                                        fontSize: '0.85rem',
                                        opacity: '0.8',
                                    }}
                                >
                                    {event.venue}, {event.location}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {events.length === 0 && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '2rem',
                        opacity: '0.6',
                        fontStyle: 'italic',
                    }}
                >
                    No events to display.
                </div>
            )}
        </div>
    );

    return (
        <>
            {showUpcoming && (
                <>
                    {upcomingEvents.length > 0 ? (
                        <EventTable
                            events={upcomingEvents}
                            title="Upcoming Events"
                        />
                    ) : (
                        <div style={{ marginBottom: '3rem' }}>
                            <h2
                                className="events-calendar-title"
                                style={{
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    fontWeight: '400',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '1.5rem',
                                    textAlign: 'left',
                                }}
                            >
                                Upcoming Events
                            </h2>
                            <div
                                className="events-calendar-table"
                                style={{ overflowX: 'auto' }}
                            >
                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        color: '#fff',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                borderBottom:
                                                    '1px solid rgba(255, 255, 255, 0.3)',
                                            }}
                                        >
                                            <th
                                                className="events-date-column"
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '1rem 0',
                                                    fontWeight: '400',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    fontSize: '0.8rem',
                                                    opacity: '0.8',
                                                    width: '25%',
                                                }}
                                            >
                                                Date
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '1rem 0',
                                                    fontWeight: '400',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    fontSize: '0.8rem',
                                                    opacity: '0.8',
                                                    width: '50%',
                                                }}
                                            >
                                                Event
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '1rem 0',
                                                    fontWeight: '400',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    fontSize: '0.8rem',
                                                    opacity: '0.8',
                                                    width: '25%',
                                                }}
                                            >
                                                Location
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            style={{
                                                borderBottom:
                                                    '1px solid rgba(255, 255, 255, 0.1)',
                                            }}
                                        >
                                            <td
                                                className="events-date-column"
                                                style={{
                                                    padding: '1.25rem 0',
                                                    verticalAlign: 'top',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '300',
                                                }}
                                            >
                                                TBD
                                            </td>
                                            <td
                                                style={{
                                                    padding: '1.25rem 0',
                                                    paddingRight: '1rem',
                                                    verticalAlign: 'top',
                                                    lineHeight: '1.4',
                                                    fontSize: '0.85rem',
                                                }}
                                            >
                                                TBD
                                            </td>
                                            <td
                                                style={{
                                                    padding: '1.25rem 0',
                                                    verticalAlign: 'top',
                                                    fontSize: '0.85rem',
                                                    opacity: '0.8',
                                                }}
                                            >
                                                TBD
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {showPast && pastEvents.length > 0 && (
                <EventTable events={pastEvents} title="Previous Events" />
            )}
        </>
    );
};

export default EventsCalendar;
