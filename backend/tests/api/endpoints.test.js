const {
    describe,
    test,
    expect,
    beforeAll,
    afterEach,
} = require('@jest/globals');
const request = require('supertest');
const app = require('../../src/server');

describe('API Endpoint Tests', () => {
    beforeAll(async () => {
        // Wait for server to initialize
        await global.testHelpers.wait(2000);
    });

    afterEach(async () => {
        await global.testHelpers.cleanupTestData();
    });

    describe('Health Check', () => {
        test('GET /api/health should return success', async () => {
            const response = await request(app).get('/api/health').expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.database).toBe('connected');
            expect(response.body.timestamp).toBeDefined();
        });
    });

    describe('Inventory API', () => {
        test('GET /api/inventory should return inventory data', async () => {
            const response = await request(app)
                .get('/api/inventory')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.inventory).toBeDefined();
            expect(typeof response.body.inventory).toBe('object');
        });

        test('PUT /api/inventory/admin should update inventory with valid auth', async () => {
            // First create test inventory
            await global.testHelpers.createTestInventory();

            const response = await request(app)
                .put('/api/inventory/admin')
                .send({
                    password: 'admin123',
                    productId: 'test-item',
                    size: 'M',
                    quantity: 20,
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.inventory['test-item'].inventory.M).toBe(20);
        });

        test('PUT /api/inventory/admin should reject invalid auth', async () => {
            const response = await request(app)
                .put('/api/inventory/admin')
                .send({
                    password: 'wrongpassword',
                    productId: 'test-item',
                    size: 'M',
                    quantity: 20,
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Unauthorized');
        });

        test('POST /api/inventory/decrement should update inventory on purchase', async () => {
            // Create test inventory
            await global.testHelpers.createTestInventory();

            const response = await request(app)
                .post('/api/inventory/decrement')
                .send({
                    items: [{ id: 'test-item', size: 'M', quantity: 2 }],
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.updates).toHaveLength(1);
            expect(response.body.updates[0].newStock).toBe(8); // 10 - 2 = 8
        });
    });

    describe('Events API', () => {
        test('GET /api/events should return events list', async () => {
            const response = await request(app).get('/api/events').expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.events)).toBe(true);
        });

        test('POST /api/events/admin should create new event with valid auth', async () => {
            const eventData = {
                password: 'admin123',
                title: 'TEST API Event',
                date: '2025-08-15',
                time: '8:00PM',
                venue: 'Test API Venue',
                location: 'Test City, TS',
                description: 'Created via API test',
            };

            const response = await request(app)
                .post('/api/events/admin')
                .send(eventData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.event.title).toBe(eventData.title);
            expect(response.body.event.venue).toBe(eventData.venue);
        });

        test('POST /api/events/admin should reject missing required fields', async () => {
            const response = await request(app)
                .post('/api/events/admin')
                .send({
                    password: 'admin123',
                    title: 'Incomplete Event',
                    // Missing required fields: date, venue, location
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Missing required fields');
        });
    });

    describe('Videos API', () => {
        test('GET /api/videos should return videos list', async () => {
            const response = await request(app).get('/api/videos').expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.videos)).toBe(true);
        });

        test('POST /api/videos/admin should create new video', async () => {
            const videoData = {
                password: 'admin123',
                youtubeId: 'TESTAPI123',
                title: 'TEST API Video',
                description: 'Created via API test',
            };

            const response = await request(app)
                .post('/api/videos/admin')
                .send(videoData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.video.youtubeId).toBe(videoData.youtubeId);
            expect(response.body.video.title).toBe(videoData.title);
        });
    });

    describe('Bio API', () => {
        test('GET /api/bio should return bio data', async () => {
            const response = await request(app).get('/api/bio').expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.bio).toBeDefined();
            expect(response.body.bio.id).toBeDefined();
        });

        test('PUT /api/bio/admin should update bio with valid auth', async () => {
            const updateData = {
                password: 'admin123',
                mainText: ['Updated bio text via API test'],
                bandImage: '/test/api-image.jpg',
            };

            const response = await request(app)
                .put('/api/bio/admin')
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.bio.mainText).toEqual(updateData.mainText);
        });
    });

    describe('Lyrics API', () => {
        test('GET /api/lyrics should return lyrics list', async () => {
            const response = await request(app).get('/api/lyrics').expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.lyrics)).toBe(true);
        });

        test('POST /api/lyrics/admin should create new song', async () => {
            const songData = {
                password: 'admin123',
                title: 'TEST API Song',
                lyrics: 'Test lyrics content\nCreated via API',
                isInstrumental: false,
            };

            const response = await request(app)
                .post('/api/lyrics/admin')
                .send(songData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.song.title).toBe(songData.title);
            expect(response.body.song.lyrics).toBe(songData.lyrics);
        });
    });

    describe('Error Handling', () => {
        test('should return 404 for non-existent endpoints', async () => {
            const response = await request(app)
                .get('/api/nonexistent')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('API endpoint not found');
        });

        test('should handle malformed JSON requests', async () => {
            const response = await request(app)
                .post('/api/inventory/admin')
                .set('Content-Type', 'application/json')
                .send('{"invalid": json}')
                .expect(400);
        });

        test('should handle server errors gracefully', async () => {
            // Test with invalid data that might cause server error
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
        });
    });

    describe('Authentication', () => {
        const protectedEndpoints = [
            { method: 'put', path: '/api/inventory/admin' },
            { method: 'post', path: '/api/events/admin' },
            { method: 'put', path: '/api/events/admin/test-id' },
            { method: 'delete', path: '/api/events/admin/test-id' },
            { method: 'post', path: '/api/videos/admin' },
            { method: 'put', path: '/api/videos/admin/test-id' },
            { method: 'delete', path: '/api/videos/admin/test-id' },
            { method: 'put', path: '/api/bio/admin' },
            { method: 'post', path: '/api/lyrics/admin' },
            { method: 'put', path: '/api/lyrics/admin/test-id' },
            { method: 'delete', path: '/api/lyrics/admin/test-id' },
        ];

        test.each(protectedEndpoints)(
            'should require authentication for $method $path',
            async ({ method, path }) => {
                const response = await request(app)
                    [method](path)
                    .send({ password: 'wrongpassword', title: 'Test' });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toBe('Unauthorized');
            }
        );
    });
});
