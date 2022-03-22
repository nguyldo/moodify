const mongoose = require('mongoose');

const schema = mongoose.Schema({
<<<<<<< HEAD
  userID: String,
  recommendedSongIDs: Array,
  logins: Number,
  numRecommendations: Number,
  loggedin: Boolean,
  topSongs: Object,
  topArtists: Object,
  communityTime: Number,
  personalTime: Number,
});
=======
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
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd

module.exports = mongoose.model('User', schema);
