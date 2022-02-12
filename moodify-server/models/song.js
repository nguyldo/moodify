const mongoose = require("mongoose");

const schema = mongoose.Schema({
    songID: Number,
    songName: String,
    songArtist: String,
    songAlbum: String,
    moodTag: Array,
    popularity: Number,
    performedBy: String,
    writtenBy: String,
    producedBy: String
})

module.exports = mongoose.model("Song", schema)