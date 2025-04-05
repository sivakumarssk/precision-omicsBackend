const mongoose = require('mongoose');

const PastEventsSchema = new mongoose.Schema({
    eventDate: {
        type: String,
        required: true,
        unique: true, // Ensure eventDate is unique
    },
    eventImages: [String], // Array of image file paths
    eventPdf: {
        type: String, // Single PDF file path
        default: '',
    },
});

module.exports = mongoose.model("PastEvent", PastEventsSchema);
