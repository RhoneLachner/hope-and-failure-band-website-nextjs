const { prisma } = require('../services/databaseService');

// Initial events data for seeding
const INITIAL_EVENTS = [
    {
        id: '1',
        title: 'Hope & Failure @ Cascadian Midsummer 2025 (w/ Ragana, Cinder Well, Hulder, Alda, Illudium, IIII, Aerial Ruin, Geist & The Sacred Ensemble, & more)',
        date: '2025-06-21',
        time: '4:00PM',
        venue: 'Red Hawk Avalon',
        location: 'Pe Ell, WA',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '2',
        title: 'Geremiah (Album Release), Cold Stars, Hope & Failure',
        date: '2025-05-24',
        time: '7:00PM',
        venue: 'High Water Mark',
        location: 'Portland, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '3',
        title: 'Hope & Failure (Acoustic), Byssus, Headstone Brigade',
        date: '2025-04-05',
        time: '7:00PM',
        venue: 'Azoth',
        location: 'Portland, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '4',
        title: 'Hope & Failure @ Lúnasa Cascadia 2024 (w/ Xasthur, Aerial Ruin, Luneau, Toby Driver, Faun Fables, Geist & The Sacred Ensemble, Luna Negra, Venetian Veil, Shifting Harbor & more)',
        date: '2024-07-26',
        time: '8:00PM',
        venue: 'Dundee Lodge',
        location: 'Gaston, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '5',
        title: 'Geremiah, Dooley, Hope & Failure',
        date: '2024-05-16',
        time: '8:00PM',
        venue: 'Tum Tum Turn',
        location: 'Portland, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '6',
        title: 'CONVEXITY Vol. 1 - Hope and Failure, Venetian Veil, Dick Fitts, and a New unnamed project featuring Jet Shea, Kora Link, Killean, and Maggie Jane',
        date: '2024-03-23',
        time: '8:00PM',
        venue: 'Azoth',
        location: 'Portland, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '7',
        title: 'Hope & Failure @ Lúnasa Cascadia 2023 (w/ Grails, Luna Negra, Alora Crucible, F-Space, Theif, Kayo Dot, Nasalrod & more)',
        date: '2023-07-27',
        time: '7:00PM',
        venue: 'Dundee Lodge',
        location: 'Gaston, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '8',
        title: 'Hope & Failure, Atminiana, Backseat Plastic',
        date: '2023-07-20',
        time: '7:00PM',
        venue: 'High Water Mark',
        location: 'Portland, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '9',
        title: 'Hope & Failure (Acoustic), Eef Barzelay of Clem Snide',
        date: '2023-07-16',
        time: '7:00PM',
        venue: 'Birb House',
        location: 'Vancouver, WA',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '10',
        title: 'Hope & Failure @ Party Off The Grid 2023 (w/ Body Shame, Imindparade, Library Studies & more)',
        date: '2023-06-23',
        time: '11:00PM',
        venue: 'Secret Location',
        location: 'Mt Hood, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '11',
        title: 'Hope & Failure, Blood Moon, GrImA',
        date: '2022-07-28',
        time: '7:00PM',
        venue: 'High Water Mark',
        location: 'Portland, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
    {
        id: '12',
        title: 'Hope & Failure, Violetera, Has // Will',
        date: '2022-07-16',
        time: '8:00PM',
        venue: 'No Fun Bar',
        location: 'Portland, OR',
        isPast: true,
        description: '',
        ticketLink: '',
    },
];

// Initialize events in database if not exists
async function initializeEvents() {
    try {
        const existingEvents = await prisma.event.findMany();

        if (existingEvents.length === 0) {
            console.log('🌱 Seeding initial events data...');

            for (const event of INITIAL_EVENTS) {
                await prisma.event.create({
                    data: {
                        id: event.id,
                        title: event.title,
                        date: event.date,
                        time: event.time || '',
                        venue: event.venue,
                        location: event.location,
                        isPast: event.isPast,
                        description: event.description || '',
                        ticketLink: event.ticketLink || '',
                    },
                });
            }

            console.log('✅ Initial events data seeded successfully');
        }
    } catch (error) {
        console.error('❌ Error initializing events:', error);
    }
}

// Events operations
async function getAllEvents() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'desc' },
        });
        return events;
    } catch (error) {
        console.error('❌ Error fetching events:', error);
        return [];
    }
}

async function addEvent(eventData) {
    try {
        // Generate new ID
        const lastEvent = await prisma.event.findFirst({
            orderBy: { id: 'desc' },
        });
        const newId = lastEvent ? (parseInt(lastEvent.id) + 1).toString() : '1';

        const newEvent = await prisma.event.create({
            data: {
                id: newId,
                title: eventData.title,
                date: eventData.date,
                time: eventData.time || '',
                venue: eventData.venue,
                location: eventData.location,
                description: eventData.description || '',
                ticketLink: eventData.ticketLink || '',
                isPast: new Date(eventData.date) < new Date(),
            },
        });

        return newEvent;
    } catch (error) {
        console.error('❌ Error adding event:', error);
        return null;
    }
}

async function updateEvent(id, eventData) {
    try {
        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                ...eventData,
                isPast: new Date(eventData.date) < new Date(),
            },
        });

        return updatedEvent;
    } catch (error) {
        console.error('❌ Error updating event:', error);
        return null;
    }
}

async function deleteEvent(id) {
    try {
        const deletedEvent = await prisma.event.delete({
            where: { id },
        });

        return deletedEvent;
    } catch (error) {
        console.error('❌ Error deleting event:', error);
        return null;
    }
}

module.exports = {
    initializeEvents,
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent,
};
