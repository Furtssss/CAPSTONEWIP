// documentModel.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    originationSection: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    seriesNumber: {
        type: String, // Assuming series number is a string
        required: true,
    },
    revisionNumber: {
        type: String, // Assuming revenue number is a string
        required: true,
    },
    sourceDocument: {
        type: String,
        required: true,
    },
    natureOfDocument: {
        type: String,
        required: true,
    },
    submittedBy: {   
        type: String,
        required: true,
    },
});

const DocumentModel = mongoose.model('Document', documentSchema);

module.exports = DocumentModel;
