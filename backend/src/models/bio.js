const { prisma } = require('../services/databaseService');

// Initial bio data for seeding
const INITIAL_BIO = {
    id: '1',
    mainText: [
        'Hope & Failure is a Portland-based ethereal doom-folk band whose sound navigates between delicate, atmospheric, and heavy/cathartic moments. Their lyrics explore themes of death, rebirth, nature, connection with the unseen, and a desire to exist together beyond the confines of the capitalist hellscape.',
        "Beginning in 2022 as a mid-quarantine daydream and extension of Rhone's side project Mistaken for Ghosts, Hope & Failure grew from an acoustic folk project into a much louder, expansive, and collaborative entity. Current band members include Rhone Lachner (vocals, guitar, flute, cello), Mikey Romay (drums, synth), Max Baker (bass), and Michael Connely (violin).",
        'Prior bands of current members include Strangeweather, Mistaken for Ghosts, Pretenser, and A.M. Error. They draw inspiration from artists such as Portishead, Yob, Dead Can Dance, Antiproduct, Shipping News, Chopin, and Enya.',
    ],
    bandImage: '/assets/images/HopeFailure-BandPic.jpg',
    pastMembers: ['Thee one and only Sam Forst (Bass)'],
    photography: [
        {
            name: 'Sarah Nelson',
            instagram: 'sarahnelson.design',
            url: 'https://instagram.com/sarahnelson.design',
        },
        {
            name: 'Tom Asselin',
            instagram: 'shiftingharborgrams',
            url: 'https://instagram.com/shiftingharborgrams',
        },
    ],
};

// Initialize bio in database if not exists
async function initializeBio() {
    try {
        const existingBio = await prisma.bio.findUnique({ where: { id: '1' } });

        if (!existingBio) {
            console.log('🌱 Seeding initial bio data...');

            await prisma.bio.create({
                data: {
                    id: INITIAL_BIO.id,
                    mainText: INITIAL_BIO.mainText,
                    bandImage: INITIAL_BIO.bandImage,
                    pastMembers: INITIAL_BIO.pastMembers,
                    photography: INITIAL_BIO.photography,
                },
            });

            console.log('✅ Initial bio data seeded successfully');
        }
    } catch (error) {
        console.error('❌ Error initializing bio:', error);
    }
}

// Bio operations
async function getBio() {
    try {
        const bio = await prisma.bio.findUnique({ where: { id: '1' } });
        return bio || INITIAL_BIO;
    } catch (error) {
        console.error('❌ Error fetching bio:', error);
        return INITIAL_BIO;
    }
}

async function updateBio(bioData) {
    try {
        const updatedBio = await prisma.bio.upsert({
            where: { id: '1' },
            update: bioData,
            create: {
                id: '1',
                ...bioData,
            },
        });
        return updatedBio;
    } catch (error) {
        console.error('❌ Error updating bio:', error);
        return null;
    }
}

module.exports = {
    initializeBio,
    getBio,
    updateBio,
};
