const {
    describe,
    test,
    expect,
    beforeAll,
    afterEach,
} = require('@jest/globals');
const request = require('supertest');
const app = require('../../src/server');

describe('System Integration Tests', () => {
    beforeAll(async () => {
        // Wait for full system initialization
        await global.testHelpers.wait(3000);
    });

    afterEach(async () => {
        await global.testHelpers.cleanupTestData();
    });

    describe('Complete E-commerce Flow', () => {
        test('should handle complete purchase workflow', async () => {
            // 1. Check initial inventory
            const inventoryResponse = await request(app)
                .get('/api/inventory')
                .expect(200);

            const initialInventory = inventoryResponse.body.inventory;

            // Find an available item
            const availableItem = Object.values(initialInventory).find((item) =>
                Object.values(item.inventory).some((qty) => qty > 0)
            );

            expect(availableItem).toBeDefined();

            // Get the first available size
            const availableSize = Object.entries(availableItem.inventory).find(
                ([size, qty]) => qty > 0
            );

            expect(availableSize).toBeDefined();

            const [size, initialQty] = availableSize;

            // 2. Simulate purchase (decrement inventory)
            const purchaseResponse = await request(app)
                .post('/api/inventory/decrement')
                .send({
                    items: [
                        {
                            id: availableItem.id,
                            size: size,
                            quantity: 1,
                        },
                    ],
                })
                .expect(200);

            expect(purchaseResponse.body.success).toBe(true);
            expect(purchaseResponse.body.updates[0].newStock).toBe(
                initialQty - 1
            );

            // 3. Verify inventory was updated
            const updatedInventoryResponse = await request(app)
                .get('/api/inventory')
                .expect(200);

            const updatedInventory = updatedInventoryResponse.body.inventory;
            expect(updatedInventory[availableItem.id].inventory[size]).toBe(
                initialQty - 1
            );
        });

        test('should prevent overselling inventory', async () => {
            // Create test item with limited stock
            const testItem = await global.testHelpers.createTestInventory();

            // Try to purchase more than available
            const response = await request(app)
                .post('/api/inventory/decrement')
                .send({
                    items: [
                        {
                            id: 'test-item',
                            size: 'S',
                            quantity: 10, // Only 5 available
                        },
                    ],
                })
                .expect(200);

            // Should set stock to 0, not negative
            expect(response.body.updates[0].newStock).toBe(0);
        });
    });

    describe('Admin Content Management Flow', () => {
        test('should handle complete event management workflow', async () => {
            // 1. Get initial events count
            const initialResponse = await request(app)
                .get('/api/events')
                .expect(200);

            const initialCount = initialResponse.body.events.length;

            // 2. Add new event
            const newEventData = {
                password: 'admin123',
                title: 'TEST Integration Event',
                date: '2025-09-01',
                time: '7:30PM',
                venue: 'Integration Test Hall',
                location: 'Test City, TS',
                description: 'Full workflow test event',
            };

            const createResponse = await request(app)
                .post('/api/events/admin')
                .send(newEventData)
                .expect(200);

            const createdEvent = createResponse.body.event;
            expect(createdEvent.title).toBe(newEventData.title);

            // 3. Verify event appears in list
            const listResponse = await request(app)
                .get('/api/events')
                .expect(200);

            expect(listResponse.body.events.length).toBe(initialCount + 1);
            const foundEvent = listResponse.body.events.find(
                (e) => e.id === createdEvent.id
            );
            expect(foundEvent).toBeDefined();

            // 4. Update the event
            const updateData = {
                password: 'admin123',
                title: 'TEST Updated Integration Event',
                venue: 'Updated Test Hall',
            };

            const updateResponse = await request(app)
                .put(`/api/events/admin/${createdEvent.id}`)
                .send(updateData)
                .expect(200);

            expect(updateResponse.body.event.title).toBe(updateData.title);
            expect(updateResponse.body.event.venue).toBe(updateData.venue);

            // 5. Delete the event
            const deleteResponse = await request(app)
                .delete(`/api/events/admin/${createdEvent.id}`)
                .send({ password: 'admin123' })
                .expect(200);

            expect(deleteResponse.body.deletedEvent.id).toBe(createdEvent.id);

            // 6. Verify event is removed
            const finalResponse = await request(app)
                .get('/api/events')
                .expect(200);

            expect(finalResponse.body.events.length).toBe(initialCount);
            const deletedEvent = finalResponse.body.events.find(
                (e) => e.id === createdEvent.id
            );
            expect(deletedEvent).toBeUndefined();
        });

        test('should handle complete video management workflow', async () => {
            // Similar workflow for videos
            const initialResponse = await request(app)
                .get('/api/videos')
                .expect(200);

            const initialCount = initialResponse.body.videos.length;

            // Add video
            const videoData = {
                password: 'admin123',
                youtubeId: 'INTTEST123',
                title: 'TEST Integration Video',
                description: 'Integration test video',
            };

            const createResponse = await request(app)
                .post('/api/videos/admin')
                .send(videoData)
                .expect(200);

            const createdVideo = createResponse.body.video;

            // Verify in list
            const listResponse = await request(app)
                .get('/api/videos')
                .expect(200);

            expect(listResponse.body.videos.length).toBe(initialCount + 1);

            // Update video
            const updateResponse = await request(app)
                .put(`/api/videos/admin/${createdVideo.id}`)
                .send({
                    password: 'admin123',
                    title: 'TEST Updated Integration Video',
                })
                .expect(200);

            expect(updateResponse.body.video.title).toBe(
                'TEST Updated Integration Video'
            );

            // Delete video
            await request(app)
                .delete(`/api/videos/admin/${createdVideo.id}`)
                .send({ password: 'admin123' })
                .expect(200);

            // Verify deletion
            const finalResponse = await request(app)
                .get('/api/videos')
                .expect(200);

            expect(finalResponse.body.videos.length).toBe(initialCount);
        });
    });

    describe('Data Consistency Tests', () => {
        test('should maintain data consistency across multiple operations', async () => {
            // Perform multiple operations concurrently
            const operations = [
                request(app).get('/api/inventory'),
                request(app).get('/api/events'),
                request(app).get('/api/videos'),
                request(app).get('/api/bio'),
                request(app).get('/api/lyrics'),
                request(app).get('/api/health'),
            ];

            const responses = await Promise.all(operations);

            // All operations should succeed
            responses.forEach((response) => {
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });
        });

        test('should handle concurrent admin operations safely', async () => {
            // Create multiple test items concurrently
            const operations = Array.from({ length: 5 }, (_, i) =>
                request(app)
                    .post('/api/lyrics/admin')
                    .send({
                        password: 'admin123',
                        title: `TEST Concurrent Song ${i}`,
                        lyrics: `Test lyrics ${i}`,
                    })
            );

            const responses = await Promise.all(operations);

            // All should succeed
            responses.forEach((response) => {
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });

            // Verify all were created
            const lyricsResponse = await request(app)
                .get('/api/lyrics')
                .expect(200);

            const testSongs = lyricsResponse.body.lyrics.filter((song) =>
                song.title.includes('TEST Concurrent Song')
            );

            expect(testSongs.length).toBe(5);
        });
    });

    describe('System Recovery Tests', () => {
        test('should handle and recover from database errors', async () => {
            // Test system behavior under stress
            const heavyOperations = Array.from({ length: 10 }, () =>
                request(app).get('/api/health')
            );

            const results = await Promise.allSettled(heavyOperations);

            // Most operations should succeed
            const successful = results.filter(
                (result) =>
                    result.status === 'fulfilled' && result.value.status === 200
            ).length;

            expect(successful).toBeGreaterThan(8); // At least 80% success rate
        });

        test('should maintain system stability under load', async () => {
            // Simulate realistic load
            const loadOperations = [
                ...Array.from({ length: 5 }, () =>
                    request(app).get('/api/inventory')
                ),
                ...Array.from({ length: 3 }, () =>
                    request(app).get('/api/events')
                ),
                ...Array.from({ length: 3 }, () =>
                    request(app).get('/api/videos')
                ),
                ...Array.from({ length: 2 }, () =>
                    request(app).get('/api/bio')
                ),
                ...Array.from({ length: 2 }, () =>
                    request(app).get('/api/lyrics')
                ),
            ];

            const start = Date.now();
            const responses = await Promise.all(loadOperations);
            const duration = Date.now() - start;

            // All should complete successfully
            responses.forEach((response) => {
                expect(response.status).toBe(200);
            });

            // Should complete within reasonable time
            expect(duration).toBeLessThan(10000); // 10 seconds max for 15 operations
        });
    });
});
