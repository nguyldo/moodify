const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userID: String,
    type: String,
    timeStamp: Array,
    totalCount: Number,
})

module.exports = mongoose.model("Mood", schema)
//test