const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userId: String,
    recommendedSongIds: Array,
    logins: Number,
    numRecommendations: Number,
    loggedin: Boolean,
    topSongs: Object,
    topArtists: Object,
    communityTime: Number,
    personalTime: Number
})

module.exports = mongoose.model("User", schema)