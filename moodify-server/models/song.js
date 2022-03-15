const mongoose = require("mongoose");

const schema = mongoose.Schema({
    songId: String,
    songName: String,
    songArtist: Array,
    artistUrl: Array,
    songAlbum: String,
    albumUrl: String,
    imageUrl: String,
    moodTag: Array,
    associatedFeels: Array,
    explicit: Boolean,
    popularity: Number,
    performedBy: Array,
    writtenBy: Array,
    producedBy: Array,
    adminRec: Boolean
})

module.exports = mongoose.model("Song", schema)