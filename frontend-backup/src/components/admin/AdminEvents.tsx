import React, { useState } from 'react';
import { useEvents } from '../../context/EventsContext';
import type { Event } from '../../context/EventsContext';
import AdminMessage from './AdminMessage';

interface AdminEventsProps {
    setMessage: (message: string) => void;
    message: string;
    loading: boolean;
}

const AdminEvents: React.FC<AdminEventsProps> = ({
    setMessage,
    message,
    loading,
}) => {
    const { events, addEvent, updateEvent, deleteEvent, fetchEvents } =
        useEvents();

    // Events state
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'isPast'>>({
        title: '',
        date: '',
        time: '',
        venue: '',
        location: '',
        description: '',
        ticketLink: '',
    });

    return (
        <div>
            <h2
                style={{
                    marginBottom: '2rem',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}
            >
                Event Management
            </h2>

            <AdminMessage message={message} />

            {/* Add New Event Form */}
            <div
                style={{
                    background: 'rgba(20, 20, 20, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginBottom: '2rem',
                }}
            >
                <h3
                    style={{
                        marginBottom: '1.5rem',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                    }}
                >
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Event Title *"
                        value={
                            editingEvent ? editingEvent.title : newEvent.title
                        }
                        onChange={(e) =>
                            editingEvent
                                ? setEditingEvent({
                                      ...editingEvent,
                                      title: e.target.value,
                                  })
                                : setNewEvent({
                                      ...newEvent,
                                      title: e.target.value,
                                  })
                        }
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '1rem',
                        }}
                    />

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                        }}
                    >
                        <input
                            type="date"
                            value={
                                editingEvent ? editingEvent.date : newEvent.date
                            }
                            onChange={(e) =>
                                editingEvent
                                    ? setEditingEvent({
                                          ...editingEvent,
                                          date: e.target.value,
                                      })
                                    : setNewEvent({
                                          ...newEvent,
                                          date: e.target.value,
                                      })
                            }
                            style={{
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '1rem',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Time (e.g., 7:00PM)"
                            value={
                                editingEvent
                                    ? editingEvent.time || ''
                                    : newEvent.time
                            }
                            onChange={(e) =>
                                editingEvent
                                    ? setEditingEvent({
                                          ...editingEvent,
                                          time: e.target.value,
                                      })
                                    : setNewEvent({
                                          ...newEvent,
                                          time: e.target.value,
                                      })
                            }
                            style={{
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Venue *"
                            value={
                                editingEvent
                                    ? editingEvent.venue
                                    : newEvent.venue
                            }
                            onChange={(e) =>
                                editingEvent
                                    ? setEditingEvent({
                                          ...editingEvent,
                                          venue: e.target.value,
                                      })
                                    : setNewEvent({
                                          ...newEvent,
                                          venue: e.target.value,
                                      })
                            }
                            style={{
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '1rem',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Location *"
                            value={
                                editingEvent
                                    ? editingEvent.location
                                    : newEvent.location
                            }
                            onChange={(e) =>
                                editingEvent
                                    ? setEditingEvent({
                                          ...editingEvent,
                                          location: e.target.value,
                                      })
                                    : setNewEvent({
                                          ...newEvent,
                                          location: e.target.value,
                                      })
                            }
                            style={{
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <textarea
                        placeholder="Description (optional)"
                        value={
                            editingEvent
                                ? editingEvent.description || ''
                                : newEvent.description
                        }
                        onChange={(e) =>
                            editingEvent
                                ? setEditingEvent({
                                      ...editingEvent,
                                      description: e.target.value,
                                  })
                                : setNewEvent({
                                      ...newEvent,
                                      description: e.target.value,
                                  })
                        }
                        rows={3}
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '1rem',
                            resize: 'vertical',
                        }}
                    />

                    <input
                        type="url"
                        placeholder="Ticket Link (optional)"
                        value={
                            editingEvent
                                ? editingEvent.ticketLink || ''
                                : newEvent.ticketLink
                        }
                        onChange={(e) =>
                            editingEvent
                                ? setEditingEvent({
                                      ...editingEvent,
                                      ticketLink: e.target.value,
                                  })
                                : setNewEvent({
                                      ...newEvent,
                                      ticketLink: e.target.value,
                                  })
                        }
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '1rem',
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                        }}
                    >
                        <button
                            onClick={async () => {
                                const eventData = editingEvent || newEvent;
                                if (
                                    !eventData.title ||
                                    !eventData.date ||
                                    !eventData.venue ||
                                    !eventData.location
                                ) {
                                    setMessage(
                                        '❌ Please fill in all required fields (title, date, venue, location)'
                                    );
                                    return;
                                }

                                const success = editingEvent
                                    ? await updateEvent(
                                          editingEvent.id,
                                          eventData
                                      )
                                    : await addEvent(eventData);

                                if (success) {
                                    setMessage(
                                        editingEvent
                                            ? '✅ Event updated successfully'
                                            : '✅ Event added successfully'
                                    );
                                    setEditingEvent(null);
                                    setNewEvent({
                                        title: '',
                                        date: '',
                                        time: '',
                                        venue: '',
                                        location: '',
                                        description: '',
                                        ticketLink: '',
                                    });
                                    await fetchEvents();
                                }
                            }}
                            disabled={loading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'none',
                                border: '1px solid #4CAF50',
                                borderRadius: '4px',
                                color: '#4CAF50',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.5 : 1,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {editingEvent ? 'Update Event' : 'Add Event'}
                        </button>

                        {editingEvent && (
                            <button
                                onClick={() => {
                                    setEditingEvent(null);
                                    setNewEvent({
                                        title: '',
                                        date: '',
                                        time: '',
                                        venue: '',
                                        location: '',
                                        description: '',
                                        ticketLink: '',
                                    });
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'none',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Events List */}
            <div>
                <h3
                    style={{
                        marginBottom: '1.5rem',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                    }}
                >
                    Existing Events ({events.length})
                </h3>

                {events.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '2rem',
                            opacity: 0.6,
                            fontStyle: 'italic',
                        }}
                    >
                        No events found. Add your first event above.
                    </div>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.id}
                            style={{
                                background: 'rgba(20, 20, 20, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                marginBottom: '1rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h4
                                        style={{
                                            fontSize: '1.1rem',
                                            marginBottom: '0.5rem',
                                            color: event.isPast
                                                ? '#aaa'
                                                : '#fff',
                                        }}
                                    >
                                        {event.title}
                                    </h4>
                                    <p
                                        style={{
                                            margin: '0.25rem 0',
                                            opacity: 0.8,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        📅 {event.date}{' '}
                                        {event.time && `@ ${event.time}`}
                                    </p>
                                    <p
                                        style={{
                                            margin: '0.25rem 0',
                                            opacity: 0.8,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        📍 {event.venue}, {event.location}
                                    </p>
                                    {event.description && (
                                        <p
                                            style={{
                                                margin: '0.5rem 0 0 0',
                                                opacity: 0.7,
                                                fontSize: '0.85rem',
                                                lineHeight: '1.4',
                                            }}
                                        >
                                            {event.description}
                                        </p>
                                    )}
                                    {event.ticketLink && (
                                        <p
                                            style={{
                                                margin: '0.25rem 0',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            🎫{' '}
                                            <a
                                                href={event.ticketLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: '#4CAF50',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                Tickets
                                            </a>
                                        </p>
                                    )}
                                    {event.isPast && (
                                        <span
                                            style={{
                                                fontSize: '0.8rem',
                                                color: '#999',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            Past Event
                                        </span>
                                    )}
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <button
                                        onClick={() => setEditingEvent(event)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'none',
                                            border: '1px solid #2196F3',
                                            borderRadius: '4px',
                                            color: '#2196F3',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (
                                                confirm(
                                                    `Are you sure you want to delete "${event.title}"?`
                                                )
                                            ) {
                                                const success =
                                                    await deleteEvent(event.id);
                                                if (success) {
                                                    setMessage(
                                                        '✅ Event deleted successfully'
                                                    );
                                                    await fetchEvents();
                                                }
                                            }
                                        }}
                                        disabled={loading}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'none',
                                            border: '1px solid #f44336',
                                            borderRadius: '4px',
                                            color: '#f44336',
                                            fontSize: '0.8rem',
                                            cursor: loading
                                                ? 'not-allowed'
                                                : 'pointer',
                                            opacity: loading ? 0.5 : 1,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminEvents;
