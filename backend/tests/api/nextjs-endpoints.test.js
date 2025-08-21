const {
    describe,
    test,
    expect,
    beforeAll,
    afterEach,
} = require('@jest/globals');
const request = require('supertest');
const app = require('../../src/server');

describe('Next.js API Integration Tests', () => {
    beforeAll(async () => {
        // Wait for server to initialize
        await global.testHelpers.wait(3000);

        // Verify database state
        const dbState = await global.testHelpers.verifyDatabaseState();
        expect(dbState).toBe(true);
    });

    afterEach(async () => {
        await global.testHelpers.cleanupTestData();
    });

    describe('Health Check & Server Status', () => {
        test('GET /api/health should return success with Next.js environment', async () => {
            const response = await request(app).get('/api/health').expect(200);
            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );

            expect(body.success).toBe(true);
            expect(body.database).toBe('connected');
            expect(body.message).toBe('Hope & Failure API is running');
            expect(body.timestamp).toBeDefined();
        });
    });

    describe('Videos API - Next.js Proxied Requests', () => {
        test('GET /api/videos should work with Next.js proxy', async () => {
            const response = await request(app).get('/api/videos').expect(200);
            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );

            expect(body.success).toBe(true);
            expect(Array.isArray(body.videos)).toBe(true);
            expect(body.videos.length).toBeGreaterThanOrEqual(0);
        });

        test('POST /api/admin/videos should create video for Next.js frontend', async () => {
            const videoData = {
                password: 'admin123',
                youtubeId: 'NEXTJS_TEST123',
                title: 'TEST Next.js Video',
                description: 'Created for Next.js integration test',
                order: 999,
            };

            const response = await request(app)
                .post('/api/admin/videos')
                .send(videoData)
                .expect(200);

            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );
            expect(body.success).toBe(true);
            expect(body.video.youtubeId).toBe(videoData.youtubeId);
            expect(body.video.title).toBe(videoData.title);
        });

        test('Should handle video operations with proper ordering', async () => {
            // Create multiple videos
            const video1Data = {
                password: 'admin123',
                youtubeId: 'TEST_ORDER_1',
                title: 'TEST Video Order 1',
                order: 1,
            };

            const video2Data = {
                password: 'admin123',
                youtubeId: 'TEST_ORDER_2',
                title: 'TEST Video Order 2',
                order: 2,
            };

            await request(app).post('/api/admin/videos').send(video1Data);
            await request(app).post('/api/admin/videos').send(video2Data);

            // Verify ordering
            const response = await request(app).get('/api/videos');
            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );

            const testVideos = body.videos.filter((v) =>
                v.title.includes('TEST Video Order')
            );
            expect(testVideos).toHaveLength(2);
            expect(testVideos[0].order).toBeLessThan(testVideos[1].order);
        });
    });

    describe('Events API - Next.js Integration', () => {
        test('GET /api/events should return events for calendar component', async () => {
            const response = await request(app).get('/api/events').expect(200);
            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );

            expect(body.success).toBe(true);
            expect(Array.isArray(body.events)).toBe(true);
        });

        test('Should properly handle event date formatting for Next.js', async () => {
            const eventData = {
                password: 'admin123',
                title: 'TEST Next.js Event',
                date: '2025-08-15',
                time: '8:00PM',
                venue: 'Next.js Test Venue',
                location: 'Next.js City, NJ',
                description: 'Event for Next.js testing',
                ticketLink: 'https://nextjs-test.com',
            };

            const response = await request(app)
                .post('/api/admin/events')
                .send(eventData)
                .expect(200);

            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );
            expect(body.success).toBe(true);
            expect(body.event.date).toBe(eventData.date);
            expect(body.event.isPast).toBe(false);
        });
    });

    describe('Bio API - Next.js Context Integration', () => {
        test('GET /api/bio should return bio data compatible with Next.js context', async () => {
            const response = await request(app).get('/api/bio').expect(200);
            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );

            expect(body.success).toBe(true);
            expect(body.bio).toBeDefined();
            expect(body.bio.id).toBeDefined();
            expect(Array.isArray(body.bio.mainText)).toBe(true);
        });
    });

    describe('Lyrics API - Next.js Page Integration', () => {
        test('GET /api/lyrics should return lyrics for Next.js lyrics page', async () => {
            const response = await request(app).get('/api/lyrics').expect(200);
            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );

            expect(body.success).toBe(true);
            expect(Array.isArray(body.lyrics)).toBe(true);
        });

        test('Should handle instrumental songs properly for Next.js display', async () => {
            const instrumentalData = {
                password: 'admin123',
                title: 'TEST Next.js Instrumental',
                lyrics: '',
                isInstrumental: true,
                order: 999,
            };

            const response = await request(app)
                .post('/api/admin/lyrics')
                .send(instrumentalData)
                .expect(200);

            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );
            expect(body.success).toBe(true);
            expect(body.song.isInstrumental).toBe(true);
            expect(body.song.lyrics).toBe('');
        });
    });

    describe('Inventory API - Next.js Shop Integration', () => {
        test('GET /api/inventory should return inventory for Next.js shop page', async () => {
            const response = await request(app)
                .get('/api/inventory')
                .expect(200);
            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );

            expect(body.success).toBe(true);
            expect(body.inventory).toBeDefined();
            expect(typeof body.inventory).toBe('object');
        });

        test('Should handle inventory decrements for Next.js checkout', async () => {
            // Create test inventory
            await global.testHelpers.createTestInventory();

            const decrementData = {
                items: [{ id: 'test-item', size: 'M', quantity: 2 }],
            };

            const response = await request(app)
                .post('/api/inventory/decrement')
                .send(decrementData)
                .expect(200);

            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );
            expect(body.success).toBe(true);
            expect(body.updates).toHaveLength(1);
            expect(body.updates[0].newStock).toBe(8); // 10 - 2 = 8
        });
    });

    describe('Error Handling - Next.js Compatibility', () => {
        test('Should return JSON errors compatible with Next.js error handling', async () => {
            const response = await request(app)
                .get('/api/nonexistent-endpoint')
                .expect(404);

            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );
            expect(body.success).toBe(false);
            expect(body.error).toBe('API endpoint not found');
            expect(body.path).toBe('/api/nonexistent-endpoint');
        });

        test('Should handle authentication errors for Next.js admin components', async () => {
            const response = await request(app)
                .post('/api/admin/videos')
                .send({
                    password: 'wrong-password',
                    youtubeId: 'TEST123',
                    title: 'Test Video',
                })
                .expect(401);

            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );
            expect(body.success).toBe(false);
            expect(body.error).toBe('Unauthorized');
        });

        test('Should gracefully handle server errors for Next.js frontend', async () => {
            // Test with data that might cause server error
            const response = await request(app)
                .put('/api/inventory/admin')
                .send({
                    password: 'admin123',
                    productId: null, // This might cause an error
                    size: 'M',
                    quantity: 10,
                });

            // Should not return 500, should handle gracefully
            expect(response.status).not.toBe(500);
            expect(response.body.success).toBeDefined();
        });
    });

    describe('Database State - Next.js Environment', () => {
        test('Should maintain database consistency across Next.js requests', async () => {
            // Create test data
            const testVideo = await global.testHelpers.createTestVideo();
            expect(testVideo).not.toBeNull();

            // Verify via API
            const response = await request(app).get('/api/videos');
            const body = await global.testHelpers.testNextJSApiResponse(
                response
            );

            const createdVideo = body.videos.find((v) => v.id === testVideo.id);
            expect(createdVideo).toBeDefined();
            expect(createdVideo.title).toBe(testVideo.title);
        });

        test('Should handle concurrent requests properly', async () => {
            // Simulate multiple concurrent requests from Next.js frontend
            const promises = [
                request(app).get('/api/videos'),
                request(app).get('/api/events'),
                request(app).get('/api/lyrics'),
                request(app).get('/api/bio'),
                request(app).get('/api/inventory'),
            ];

            const responses = await Promise.all(promises);

            // All requests should succeed
            responses.forEach((response) => {
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });
        });
    });
});
