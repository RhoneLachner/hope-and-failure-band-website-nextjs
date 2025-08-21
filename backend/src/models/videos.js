const { prisma } = require('../services/databaseService');

// Initial videos data for seeding
const INITIAL_VIDEOS = [
    {
        id: '1',
        youtubeId: '-1Z3-77cvVQ',
        title: 'HOPE & FAILURE - "BLACK HEART" (MUSIC VIDEO)',
        description: '',
        order: 1,
    },
    {
        id: '2',
        youtubeId: '_30hdyQf-jY',
        title: 'HOPE & FAILURE - "HELL AND BACK" (OFFICIAL MUSIC VIDEO)',
        description: '',
        order: 2,
    },
    {
        id: '3',
        youtubeId: 'rZVkmhlMXno',
        title: 'HOPE & FAILURE - "MIRROR ALTAR" (OFFICIAL MUSIC VIDEO)',
        description: '',
        order: 3,
    },
    {
        id: '4',
        youtubeId: '8JwBO2AP1_E',
        title: 'HOPE & FAILURE - LIVE PERFORMANCE',
        description: '',
        order: 4,
    },
    {
        id: '5',
        youtubeId: '3yPWrvQQ1PY',
        title: 'HOPE & FAILURE - STUDIO SESSION',
        description: '',
        order: 5,
    },
    {
        id: '6',
        youtubeId: 'Uh21YOZks4I',
        title: 'HOPE & FAILURE - BEHIND THE SCENES',
        description: '',
        order: 6,
    },
];

// Initialize videos in database if not exists
async function initializeVideos() {
    try {
        const existingVideos = await prisma.video.findMany();

        if (existingVideos.length === 0) {
            console.log('🌱 Seeding initial videos data...');

            for (const video of INITIAL_VIDEOS) {
                await prisma.video.create({
                    data: {
                        id: video.id,
                        youtubeId: video.youtubeId,
                        title: video.title,
                        description: video.description || '',
                        order: video.order,
                    },
                });
            }

            console.log('✅ Initial videos data seeded successfully');
        }
    } catch (error) {
        console.error('❌ Error initializing videos:', error);
    }
}

// Videos operations
async function getAllVideos() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { order: 'asc' },
        });
        return videos;
    } catch (error) {
        console.error('❌ Error fetching videos:', error);
        return [];
    }
}

async function updateVideo(id, videoData) {
    try {
        const updatedVideo = await prisma.video.update({
            where: { id },
            data: videoData,
        });
        return updatedVideo;
    } catch (error) {
        console.error('❌ Error updating video:', error);
        return null;
    }
}

async function addVideo(videoData) {
    try {
        // Generate new ID
        const lastVideo = await prisma.video.findFirst({
            orderBy: { id: 'desc' },
        });
        const newId = lastVideo ? (parseInt(lastVideo.id) + 1).toString() : '1';

        // Get next order
        const maxOrderVideo = await prisma.video.findFirst({
            orderBy: { order: 'desc' },
        });
        const newOrder = maxOrderVideo ? maxOrderVideo.order + 1 : 1;

        const newVideo = await prisma.video.create({
            data: {
                id: newId,
                youtubeId: videoData.youtubeId,
                title: videoData.title,
                description: videoData.description || '',
                order: videoData.order || newOrder,
            },
        });

        return newVideo;
    } catch (error) {
        console.error('❌ Error adding video:', error);
        return null;
    }
}

async function deleteVideo(id) {
    try {
        const deletedVideo = await prisma.video.delete({
            where: { id },
        });
        return deletedVideo;
    } catch (error) {
        console.error('❌ Error deleting video:', error);
        return null;
    }
}

module.exports = {
    initializeVideos,
    getAllVideos,
    updateVideo,
    addVideo,
    deleteVideo,
};
