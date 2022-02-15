const mongoose = require("mongoose");

const schema = mongoose.Schema({
    songID: String,
    songName: String,
    songURI: String,
    associatedFeels: String,
})

module.exports = mongoose.model("Angry", schema)