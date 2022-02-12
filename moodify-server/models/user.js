const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userID: Number,
    recommendedSongIDs: Array,
    logins: Number,
    numRecommendations: Number,
    topSongs: Object,
    topArtists: Object,
    communityTime: Number,
    personalTime: Number    
})

module.exports = mongoose.model("User", schema)