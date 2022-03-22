const mongoose = require('mongoose');

const schema = mongoose.Schema({
<<<<<<< HEAD
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
  producedBy: Array,
  adminRec: Boolean,
});
=======
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
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd

module.exports = mongoose.model('Song', schema);
