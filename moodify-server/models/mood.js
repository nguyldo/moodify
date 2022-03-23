const mongoose = require('mongoose');

const schema = mongoose.Schema({
  userId: String,
  type: String,
  timeStamp: Array,
  totalCount: Number,
});

module.exports = mongoose.model('Mood', schema);
// test
