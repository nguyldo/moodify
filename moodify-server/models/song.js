const mongoose = require("mongoose");

const schema = mongoose.Schema({
    songID: String,
    songName: String,
    songArtist: Array,
    songAlbum: String,
    genre: Array,
    moodTag: Array,
    associatedFeels: Array,
    explicit: Boolean,
    popularity: Number,
    performedBy: String,
    writtenBy: String,
    producedBy: String
})

module.exports = mongoose.model("Song", schema)