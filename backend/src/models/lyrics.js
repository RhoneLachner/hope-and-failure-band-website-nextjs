const { prisma } = require('../services/databaseService');

// Initial lyrics data for seeding
const INITIAL_LYRICS = [
    {
        id: '1',
        title: 'Mirror Altar',
        lyrics: `Mirror altar - shines bright
one then another
Breath tight
Hold on

Old and weathered - clear sight
Baby's mother
Don't die
Hold on`,
        order: 1,
        isInstrumental: false,
    },
    {
        id: '2',
        title: 'Dream for Nothing',
        lyrics: `Daylight fades
Beneath the leaves and grey
Hands for hiding
Shifting across his face

Hear them
Call your name
There again
Long forgotten friends

All we know
Written along sand
Dream for nothing
Until we find a place to land

All we are
Echoes along glass
Dream for nothing
Thought we had a second chance

You a setting sun
You the setting sun
You a setting sun
You the setting sun`,
        order: 2,
        isInstrumental: false,
    },
    {
        id: '3',
        title: 'Death is a River',
        lyrics: '',
        order: 3,
        isInstrumental: true,
    },
    {
        id: '4',
        title: 'Will You Meet Me',
        lyrics: `As all decays
It slips away

In all the darkness and the suffering
We'll be ok

With ashes in the air as babies cry
We'll see new days

With poison in the water we can swim
Away
Away
Away

Will you meet me at the river's edge?
We'll scream together until we are well
In all the darkness and the suffering
Let's dream together something more than this

Here I hope
We can grow old
Along the bend
Rest your head`,
        order: 4,
        isInstrumental: false,
    },
    {
        id: '5',
        title: 'Float',
        lyrics: `As the wind blows through
Floating
Inside exploding

Change was coming
Hearts open
You tore
Open

In all
This
Silence

Far and faded in a fold
You belonged to echo long ago

I float through
I see through
I flow through
I see through

I float`,
        order: 5,
        isInstrumental: false,
    },
];

// Initialize lyrics in database if not exists
async function initializeLyrics() {
    try {
        const existingLyrics = await prisma.lyrics.findMany();

        if (existingLyrics.length === 0) {
            console.log('🌱 Seeding initial lyrics data...');

            for (const song of INITIAL_LYRICS) {
                await prisma.lyrics.create({
                    data: {
                        id: song.id,
                        title: song.title,
                        lyrics: song.lyrics,
                        order: song.order,
                        isInstrumental: song.isInstrumental,
                    },
                });
            }

            console.log('✅ Initial lyrics data seeded successfully');
        }
    } catch (error) {
        console.error('❌ Error initializing lyrics:', error);
    }
}

// Lyrics operations
async function getAllLyrics() {
    try {
        const lyrics = await prisma.lyrics.findMany({
            orderBy: { order: 'asc' },
        });
        return lyrics;
    } catch (error) {
        console.error('❌ Error fetching lyrics:', error);
        return [];
    }
}

async function addSong(songData) {
    try {
        // Generate new ID
        const lastSong = await prisma.lyrics.findFirst({
            orderBy: { id: 'desc' },
        });
        const newId = lastSong ? (parseInt(lastSong.id) + 1).toString() : '1';

        // Get next order
        const maxOrderSong = await prisma.lyrics.findFirst({
            orderBy: { order: 'desc' },
        });
        const newOrder = maxOrderSong ? maxOrderSong.order + 1 : 1;

        const newSong = await prisma.lyrics.create({
            data: {
                id: newId,
                title: songData.title,
                lyrics: songData.lyrics || '',
                order: songData.order || newOrder,
                isInstrumental: songData.isInstrumental || false,
            },
        });

        return newSong;
    } catch (error) {
        console.error('❌ Error adding song:', error);
        return null;
    }
}

async function updateSong(id, songData) {
    try {
        const updatedSong = await prisma.lyrics.update({
            where: { id },
            data: songData,
        });
        return updatedSong;
    } catch (error) {
        console.error('❌ Error updating song:', error);
        return null;
    }
}

async function deleteSong(id) {
    try {
        const deletedSong = await prisma.lyrics.delete({
            where: { id },
        });
        return deletedSong;
    } catch (error) {
        console.error('❌ Error deleting song:', error);
        return null;
    }
}

module.exports = {
    initializeLyrics,
    getAllLyrics,
    addSong,
    updateSong,
    deleteSong,
};
