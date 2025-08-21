const inventory = require('../models/inventory');
const events = require('../models/events');
const videos = require('../models/videos');
const bio = require('../models/bio');
const lyrics = require('../models/lyrics');

// Inventory services
function getInventory() {
    return inventory.getInventory();
}

function updateInventoryItem(productId, size, newQuantity) {
    return inventory.updateInventory(productId, size, newQuantity);
}

function decrementInventoryItem(productId, size, quantity) {
    return inventory.decrementInventory(productId, size, quantity);
}

// Events services
function getAllEvents() {
    return events.getAllEvents();
}

function createEvent(eventData) {
    return events.addEvent(eventData);
}

function updateEvent(id, eventData) {
    return events.updateEvent(id, eventData);
}

function deleteEvent(id) {
    return events.deleteEvent(id);
}

// Videos services
function getAllVideos() {
    return videos.getAllVideos();
}

function updateVideo(id, videoData) {
    return videos.updateVideo(id, videoData);
}

function createVideo(videoData) {
    return videos.addVideo(videoData);
}

function deleteVideo(id) {
    return videos.deleteVideo(id);
}

// Bio services
function getBio() {
    return bio.getBio();
}

function updateBio(bioData) {
    return bio.updateBio(bioData);
}

// Lyrics services
function getAllLyrics() {
    return lyrics.getAllLyrics();
}

function createSong(songData) {
    return lyrics.addSong(songData);
}

function updateSong(id, songData) {
    return lyrics.updateSong(id, songData);
}

function deleteSong(id) {
    return lyrics.deleteSong(id);
}

// Validation helpers
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
