const mongoose = require('mongoose');

const schema = mongoose.Schema({
  songID: String,
  songName: String,
  songURI: String,
  associatedFeels: Array,
  adminRec: Boolean,
});

module.exports = mongoose.model('Excited', schema);
