const mongoose = require("mongoose");

const schema = mongoose.Schema({
    songID: String,
    songName: String,
    songURI: String,
    associatedFeels: String,
    adminRec: Boolean
})

module.exports = mongoose.model("Sad", schema)