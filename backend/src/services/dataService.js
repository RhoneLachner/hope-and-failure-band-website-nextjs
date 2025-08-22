const inventory = require('../models/inventory');
const events = require('../models/events');
const videos = require('../models/videos');
const bio = require('../models/bio');
const lyrics = require('../models/lyrics');
const {
    cacheWrapper,
    generateKey,
    invalidation,
    CACHE_TYPES,
} = require('./cacheService');

// OPTIMIZED INVENTORY SERVICES WITH CACHING
async function getInventory() {
    const cacheKey = generateKey('inventory', 'all');
    return await cacheWrapper(
        cacheKey,
        () => inventory.getInventory(),
        CACHE_TYPES.DYNAMIC
    );
}

async function updateInventoryItem(productId, size, newQuantity) {
    const result = await inventory.updateInventory(
        productId,
        size,
        newQuantity
    );
    // Invalidate inventory cache after updates
    invalidation.inventory();
    return result;
}

async function decrementInventoryItem(productId, size, quantity) {
    const result = await inventory.decrementInventory(
        productId,
        size,
        quantity
    );
    // Invalidate inventory cache after updates
    invalidation.inventory();
    return result;
}

// OPTIMIZED EVENTS SERVICES WITH CACHING
async function getAllEvents() {
    const cacheKey = generateKey('events', 'all');
    return await cacheWrapper(
        cacheKey,
        () => events.getAllEvents(),
        CACHE_TYPES.SEMI_STATIC
    );
}

async function createEvent(eventData) {
    const result = await events.addEvent(eventData);
    // Invalidate events cache after creation
    invalidation.events();
    return result;
}

async function updateEvent(id, eventData) {
    const result = await events.updateEvent(id, eventData);
    // Invalidate events cache after updates
    invalidation.events();
    return result;
}

async function deleteEvent(id) {
    const result = await events.deleteEvent(id);
    // Invalidate events cache after deletion
    invalidation.events();
    return result;
}

// OPTIMIZED VIDEOS SERVICES WITH CACHING
async function getAllVideos() {
    const cacheKey = generateKey('videos', 'all');
    return await cacheWrapper(
        cacheKey,
        () => videos.getAllVideos(),
        CACHE_TYPES.STATIC
    );
}

async function updateVideo(id, videoData) {
    const result = await videos.updateVideo(id, videoData);
    // Invalidate videos cache after updates
    invalidation.videos();
    return result;
}

async function createVideo(videoData) {
    const result = await videos.addVideo(videoData);
    // Invalidate videos cache after creation
    invalidation.videos();
    return result;
}

async function deleteVideo(id) {
    const result = await videos.deleteVideo(id);
    // Invalidate videos cache after deletion
    invalidation.videos();
    return result;
}

// OPTIMIZED BIO SERVICES WITH CACHING
async function getBio() {
    const cacheKey = generateKey('bio', 'main');
    return await cacheWrapper(cacheKey, () => bio.getBio(), CACHE_TYPES.STATIC);
}

async function updateBio(bioData) {
    const result = await bio.updateBio(bioData);
    // Invalidate bio cache after updates
    invalidation.bio();
    return result;
}

// OPTIMIZED LYRICS SERVICES WITH CACHING
async function getAllLyrics() {
    const cacheKey = generateKey('lyrics', 'all');
    return await cacheWrapper(
        cacheKey,
        () => lyrics.getAllLyrics(),
        CACHE_TYPES.STATIC
    );
}

async function createSong(songData) {
    const result = await lyrics.addSong(songData);
    // Invalidate lyrics cache after creation
    invalidation.lyrics();
    return result;
}

async function updateSong(id, songData) {
    const result = await lyrics.updateSong(id, songData);
    // Invalidate lyrics cache after updates
    invalidation.lyrics();
    return result;
}

async function deleteSong(id) {
    const result = await lyrics.deleteSong(id);
    // Invalidate lyrics cache after deletion
    invalidation.lyrics();
    return result;
}

// Validation helpers (unchanged)
function validateEventData(eventData) {
    return !!(
        eventData.title &&
        eventData.date &&
        eventData.venue &&
        eventData.location
    );
}

function validateSongData(songData) {
    return !!songData.title;
}

module.exports = {
    // Inventory
    getInventory,
    updateInventoryItem,
    decrementInventoryItem,

    // Events
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    validateEventData,

    // Videos
    getAllVideos,
    updateVideo,
    createVideo,
    deleteVideo,

    // Bio
    getBio,
    updateBio,

    // Lyrics
    getAllLyrics,
    createSong,
    updateSong,
    deleteSong,
    validateSongData,
};
