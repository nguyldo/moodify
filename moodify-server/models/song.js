const mongoose = require("mongoose");

const schema = mongoose.Schema({
    songID: String,
    songName: String,
    songArtist: Array,
    artistURL: Array,
    songAlbum: String,
    albumURL: String,
    genre: Array,
    moodTag: Array,
    associatedFeels: Array,
    explicit: Boolean,
    popularity: Number,
    performedBy: Array,
    writtenBy: Array,
    producedBy: Array
})

module.exports = mongoose.model("Song", schema)