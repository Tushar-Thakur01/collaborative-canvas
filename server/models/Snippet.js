const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
    roomId: String,
    code: String,
    pins: [{
        x: Number,
        y: Number,
        text: String,
        author: String
    }]
});

module.exports = mongoose.model("Snippet", SnippetSchema);