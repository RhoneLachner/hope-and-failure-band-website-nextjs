const {
    describe,
    test,
    expect,
    beforeAll,
    afterAll,
} = require('@jest/globals');
const request = require('supertest');
const app = require('../../src/server');

describe('Next.js System Integration Tests', () => {
    beforeAll(async () => {
        // Wait for full server initialization
        await global.testHelpers.wait(5000);

        // Verify database connectivity
        const dbState = await global.testHelpers.verifyDatabaseState();
        expect(dbState).toBe(true);
    });

    afterAll(async () => {
        // Final cleanup
        await global.testHelpers.cleanupTestData();
    });

    describe('Full Stack Data Flow - Next.js to Database', () => {
        test('Should handle complete video lifecycle from Next.js frontend', async () => {
            // 1. Create video (simulating Next.js admin)
            const createData = {
                password: 'admin123',
                youtubeId: 'SYSTEM_TEST_123',
                title: 'TEST System Integration Video',
                description: 'Full stack test',
                order: 100,
            };

            const createResponse = await request(app)
                .post('/api/admin/videos')
                .send(createData);

            expect(createResponse.status).toBe(200);
            expect(createResponse.body.success).toBe(true);
            const createdVideo = createResponse.body.video;

            // 2. Read video (simulating Next.js video page)
            const readResponse = await request(app).get('/api/videos');
            expect(readResponse.status).toBe(200);

            const foundVideo = readResponse.body.videos.find(
                (v) => v.id === createdVideo.id
            );
            expect(foundVideo).toBeDefined();
            expect(foundVideo.youtubeId).toBe(createData.youtubeId);

            // 3. Update video (simulating Next.js admin edit)
            const updateData = {
                password: 'admin123',
                title: 'TEST Updated System Integration Video',
                description: 'Updated full stack test',
            };

            const updateResponse = await request(app)
                .put(`/api/admin/videos/${createdVideo.id}`)
                .send(updateData);

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.video.title).toBe(updateData.title);

            // 4. Delete video (simulating Next.js admin delete)
            const deleteResponse = await request(app)
                .delete(`/api/admin/videos/${createdVideo.id}`)
                .send({ password: 'admin123' });

            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body.success).toBe(true);

            // 5. Verify deletion
            const verifyResponse = await request(app).get('/api/videos');
            const deletedVideo = verifyResponse.body.videos.find(
                (v) => v.id === createdVideo.id
            );
            expect(deletedVideo).toBeUndefined();
        });

        test('Should handle complete event lifecycle for Next.js calendar', async () => {
            // 1. Create event
            const eventData = {
                password: 'admin123',
                title: 'TEST System Integration Event',
                date: '2025-12-31',
                time: '11:59PM',
                venue: 'System Test Venue',
                location: 'Integration City, IN',
                description: 'Full system test event',
                ticketLink: 'https://system-test.com',
            };

            const createResponse = await request(app)
                .post('/api/admin/events')
                .send(eventData);

            expect(createResponse.status).toBe(200);
            const createdEvent = createResponse.body.event;

            // 2. Read for calendar display
            const readResponse = await request(app).get('/api/events');
            expect(readResponse.status).toBe(200);

            const foundEvent = readResponse.body.events.find(
                (e) => e.id === createdEvent.id
            );
            expect(foundEvent).toBeDefined();
            expect(foundEvent.venue).toBe(eventData.venue);

            // 3. Update event
            const updateData = {
                password: 'admin123',
                venue: 'Updated System Test Venue',
                isPast: true,
            };

            const updateResponse = await request(app)
                .put(`/api/admin/events/${createdEvent.id}`)
                .send(updateData);

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.event.venue).toBe(updateData.venue);
            expect(updateResponse.body.event.isPast).toBe(true);

            // Cleanup
            await request(app)
                .delete(`/api/admin/events/${createdEvent.id}`)
                .send({ password: 'admin123' });
        });
    });

    describe('Next.js Context Provider Integration', () => {
        test('Should provide consistent data for VideosContext', async () => {
            // Create test videos
            const video1 = {
                password: 'admin123',
                youtubeId: 'CONTEXT_TEST_1',
                title: 'TEST Context Video 1',
                order: 1,
            };

            const video2 = {
                password: 'admin123',
                youtubeId: 'CONTEXT_TEST_2',
                title: 'TEST Context Video 2',
                order: 2,
            };

            // Create videos
            const create1 = await request(app)
                .post('/api/admin/videos')
                .send(video1);
            const create2 = await request(app)
                .post('/api/admin/videos')
                .send(video2);

            expect(create1.status).toBe(200);
            expect(create2.status).toBe(200);

            // Fetch videos (simulating context fetch)
            const fetchResponse = await request(app).get('/api/videos');
            expect(fetchResponse.status).toBe(200);

            const videos = fetchResponse.body.videos.filter((v) =>
                v.title.includes('TEST Context Video')
            );
            expect(videos).toHaveLength(2);
            expect(videos[0].order).toBeLessThan(videos[1].order);

            // Cleanup
            await request(app)
                .delete(`/api/admin/videos/${create1.body.video.id}`)
                .send({ password: 'admin123' });
            await request(app)
                .delete(`/api/admin/videos/${create2.body.video.id}`)
                .send({ password: 'admin123' });
        });

        test('Should handle bio data for BioContext', async () => {
            // Get current bio
            const bioResponse = await request(app).get('/api/bio');
            expect(bioResponse.status).toBe(200);
            expect(bioResponse.body.bio).toBeDefined();
            expect(Array.isArray(bioResponse.body.bio.mainText)).toBe(true);

            const originalBio = bioResponse.body.bio;

            // Update bio (simulating admin edit)
            const updateData = {
                password: 'admin123',
                mainText: [
                    'TEST Bio Context Integration',
                    'Second paragraph for testing',
                ],
                bandImage: '/test/context-image.jpg',
            };

            const updateResponse = await request(app)
                .put('/api/bio/admin')
                .send(updateData);

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.bio.mainText).toEqual(
                updateData.mainText
            );

            // Verify update (simulating context refetch)
            const verifyResponse = await request(app).get('/api/bio');
            expect(verifyResponse.body.bio.mainText).toEqual(
                updateData.mainText
            );

            // Restore original bio
            await request(app).put('/api/bio/admin').send({
                password: 'admin123',
                mainText: originalBio.mainText,
                bandImage: originalBio.bandImage,
            });
        });
    });

    describe('Next.js Shop Integration', () => {
        test('Should handle complete purchase flow', async () => {
            // 1. Create test inventory
            const testItem = await global.testHelpers.createTestInventory();
            expect(testItem).not.toBeNull();

            // 2. Get inventory (simulating shop page load)
            const inventoryResponse = await request(app).get('/api/inventory');
            expect(inventoryResponse.status).toBe(200);
            expect(inventoryResponse.body.inventory['test-item']).toBeDefined();

            const initialStock =
                inventoryResponse.body.inventory['test-item'].inventory.M;
            expect(initialStock).toBe(10);

            // 3. Simulate purchase (cart decrement)
            const purchaseData = {
                items: [{ id: 'test-item', size: 'M', quantity: 3 }],
            };

            const purchaseResponse = await request(app)
                .post('/api/inventory/decrement')
                .send(purchaseData);

            expect(purchaseResponse.status).toBe(200);
            expect(purchaseResponse.body.success).toBe(true);
            expect(purchaseResponse.body.updates[0].newStock).toBe(7); // 10 - 3 = 7

            // 4. Verify inventory update
            const verifyResponse = await request(app).get('/api/inventory');
            expect(verifyResponse.body.inventory['test-item'].inventory.M).toBe(
                7
            );

            // Cleanup
            await global.testHelpers.cleanupTestData();
        });

        test('Should handle inventory admin updates', async () => {
            // Create test inventory
            await global.testHelpers.createTestInventory();

            // Admin update inventory
            const updateData = {
                password: 'admin123',
                productId: 'test-item',
                size: 'L',
                quantity: 25,
            };

            const updateResponse = await request(app)
                .put('/api/inventory/admin')
                .send(updateData);

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.inventory['test-item'].inventory.L).toBe(
                25
            );

            // Cleanup
            await global.testHelpers.cleanupTestData();
        });
    });

    describe('Error Recovery & Resilience', () => {
        test('Should handle database reconnection gracefully', async () => {
            // Test multiple rapid requests (simulating Next.js SSR + client requests)
            const rapidRequests = Array.from({ length: 10 }, (_, i) =>
                request(app).get('/api/health')
            );

            const responses = await Promise.allSettled(rapidRequests);

            // Most requests should succeed
            const successCount = responses.filter(
                (r) => r.status === 'fulfilled' && r.value.status === 200
            ).length;

            expect(successCount).toBeGreaterThanOrEqual(8); // Allow for some connection issues
        });

        test('Should maintain API consistency during high load', async () => {
            // Simulate concurrent requests from Next.js frontend
            const concurrentRequests = [
                request(app).get('/api/videos'),
                request(app).get('/api/events'),
                request(app).get('/api/lyrics'),
                request(app).get('/api/bio'),
                request(app).get('/api/inventory'),
                request(app).get('/api/health'),
                request(app).get('/api/videos'),
                request(app).get('/api/events'),
            ];

            const responses = await Promise.all(concurrentRequests);

            // All requests should return valid data
            responses.forEach((response, index) => {
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });
        });
    });

    describe('Performance & Optimization', () => {
        test('Should respond to API requests within acceptable time limits', async () => {
            const startTime = Date.now();

            const response = await request(app).get('/api/videos');

            const responseTime = Date.now() - startTime;

            expect(response.status).toBe(200);
            expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
        });

        test('Should handle multiple admin operations efficiently', async () => {
            const startTime = Date.now();

            // Create, update, delete sequence
            const createResponse = await request(app)
                .post('/api/admin/videos')
                .send({
                    password: 'admin123',
                    youtubeId: 'PERF_TEST_123',
                    title: 'TEST Performance Video',
                });

            const videoId = createResponse.body.video.id;

            await request(app).put(`/api/admin/videos/${videoId}`).send({
                password: 'admin123',
                title: 'TEST Updated Performance Video',
            });

            await request(app)
                .delete(`/api/admin/videos/${videoId}`)
                .send({ password: 'admin123' });

            const totalTime = Date.now() - startTime;
            expect(totalTime).toBeLessThan(5000); // Complete cycle within 5 seconds
        });
    });
});
