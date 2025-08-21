const {
    describe,
    test,
    expect,
    beforeEach,
    afterEach,
} = require('@jest/globals');

// Import model functions
const {
    getInventory,
    updateInventory,
    decrementInventory,
} = require('../../src/models/inventory');
const {
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent,
} = require('../../src/models/events');
const {
    getAllVideos,
    addVideo,
    updateVideo,
    deleteVideo,
} = require('../../src/models/videos');
const { getBio, updateBio } = require('../../src/models/bio');
const {
    getAllLyrics,
    addSong,
    updateSong,
    deleteSong,
} = require('../../src/models/lyrics');

describe('Inventory Model Tests', () => {
    afterEach(async () => {
        await global.testHelpers.cleanupTestData();
    });

    test('should retrieve inventory data', async () => {
        const inventory = await getInventory();
        expect(inventory).toBeDefined();
        expect(typeof inventory).toBe('object');
    });

    test('should update inventory quantities', async () => {
        // Create test inventory item
        await global.testHelpers.createTestInventory();

        const success = await updateInventory('test-item', 'M', 15);
        expect(success).toBe(true);

        // Verify update
        const inventory = await getInventory();
        expect(inventory['test-item'].inventory.M).toBe(15);
    });

    test('should decrement inventory on purchase', async () => {
        // Create test inventory item
        await global.testHelpers.createTestInventory();

        const result = await decrementInventory('test-item', 'S', 2);

        expect(result).toBeDefined();
        expect(result.productId).toBe('test-item');
        expect(result.size).toBe('S');
        expect(result.decremented).toBe(2);
        expect(result.newStock).toBe(3); // 5 - 2 = 3
    });

    test('should handle inventory edge cases', async () => {
        // Test non-existent item
        const result = await updateInventory('non-existent', 'M', 10);
        expect(result).toBe(false);

        // Test negative decrement (should set to 0)
        await global.testHelpers.createTestInventory();
        const decrementResult = await decrementInventory('test-item', 'S', 10); // More than available
        expect(decrementResult.newStock).toBe(0);
    });
});

describe('Events Model Tests', () => {
    afterEach(async () => {
        await global.testHelpers.cleanupTestData();
    });

    test('should retrieve all events', async () => {
        const events = await getAllEvents();
        expect(Array.isArray(events)).toBe(true);
    });

    test('should add new event', async () => {
        const eventData = {
            title: 'TEST New Event',
            date: '2025-06-15',
            time: '7:00PM',
            venue: 'Test Hall',
            location: 'Test City, TS',
            description: 'Test event',
            ticketLink: 'https://test.com',
        };

        const newEvent = await addEvent(eventData);

        expect(newEvent).toBeDefined();
        expect(newEvent.title).toBe(eventData.title);
        expect(newEvent.venue).toBe(eventData.venue);
        expect(newEvent.isPast).toBe(false);
    });

    test('should update existing event', async () => {
        // Create test event
        const testEvent = await global.testHelpers.createTestEvent();

        const updateData = {
            title: 'TEST Updated Event Title',
            venue: 'Updated Venue',
        };

        const updatedEvent = await updateEvent(testEvent.id, updateData);

        expect(updatedEvent).toBeDefined();
        expect(updatedEvent.title).toBe(updateData.title);
        expect(updatedEvent.venue).toBe(updateData.venue);
    });

    test('should delete event', async () => {
        // Create test event
        const testEvent = await global.testHelpers.createTestEvent();

        const deletedEvent = await deleteEvent(testEvent.id);

        expect(deletedEvent).toBeDefined();
        expect(deletedEvent.id).toBe(testEvent.id);

        // Verify deletion
        const events = await getAllEvents();
        const exists = events.find((e) => e.id === testEvent.id);
        expect(exists).toBeUndefined();
    });
});

describe('Videos Model Tests', () => {
    afterEach(async () => {
        await global.testHelpers.cleanupTestData();
    });

    test('should retrieve all videos', async () => {
        const videos = await getAllVideos();
        expect(Array.isArray(videos)).toBe(true);
    });

    test('should add new video', async () => {
        const videoData = {
            youtubeId: 'TEST789XYZ',
            title: 'TEST New Video',
            description: 'Test video description',
            order: 100,
        };

        const newVideo = await addVideo(videoData);

        expect(newVideo).toBeDefined();
        expect(newVideo.youtubeId).toBe(videoData.youtubeId);
        expect(newVideo.title).toBe(videoData.title);
        expect(newVideo.order).toBe(videoData.order);
    });

    test('should maintain video ordering', async () => {
        // Create multiple test videos
        const video1 = await addVideo({
            youtubeId: 'TEST001',
            title: 'TEST Video 1',
            order: 1,
        });

        const video2 = await addVideo({
            youtubeId: 'TEST002',
            title: 'TEST Video 2',
            order: 2,
        });

        const videos = await getAllVideos();
        const testVideos = videos.filter((v) => v.title.includes('TEST'));

        expect(testVideos).toHaveLength(2);
        expect(testVideos[0].order).toBeLessThan(testVideos[1].order);
    });
});

describe('Bio Model Tests', () => {
    test('should retrieve bio data', async () => {
        const bio = await getBio();
        expect(bio).toBeDefined();
        expect(bio.id).toBeDefined();
        expect(Array.isArray(bio.mainText)).toBe(true);
    });

    test('should update bio data', async () => {
        const updateData = {
            mainText: ['Updated bio text for testing'],
            bandImage: '/test/image.jpg',
        };

        const updatedBio = await updateBio(updateData);

        expect(updatedBio).toBeDefined();
        expect(updatedBio.mainText).toEqual(updateData.mainText);
        expect(updatedBio.bandImage).toBe(updateData.bandImage);
    });
});

describe('Lyrics Model Tests', () => {
    afterEach(async () => {
        await global.testHelpers.cleanupTestData();
    });

    test('should retrieve all lyrics', async () => {
        const lyrics = await getAllLyrics();
        expect(Array.isArray(lyrics)).toBe(true);
    });

    test('should add new song', async () => {
        const songData = {
            title: 'TEST New Song',
            lyrics: 'Test lyrics content\nSecond line',
            isInstrumental: false,
        };

        const newSong = await addSong(songData);

        expect(newSong).toBeDefined();
        expect(newSong.title).toBe(songData.title);
        expect(newSong.lyrics).toBe(songData.lyrics);
        expect(newSong.isInstrumental).toBe(false);
    });

    test('should handle instrumental songs', async () => {
        const instrumentalData = {
            title: 'TEST Instrumental',
            lyrics: '',
            isInstrumental: true,
        };

        const instrumental = await addSong(instrumentalData);

        expect(instrumental.isInstrumental).toBe(true);
        expect(instrumental.lyrics).toBe('');
    });

    test('should maintain song ordering', async () => {
        const song1 = await addSong({
            title: 'TEST Song A',
            lyrics: 'Test content A',
            order: 1,
        });

        const song2 = await addSong({
            title: 'TEST Song B',
            lyrics: 'Test content B',
            order: 2,
        });

        const allLyrics = await getAllLyrics();
        const testSongs = allLyrics.filter((s) => s.title.includes('TEST'));

        expect(testSongs).toHaveLength(2);
        expect(testSongs[0].order).toBeLessThan(testSongs[1].order);
    });
});
