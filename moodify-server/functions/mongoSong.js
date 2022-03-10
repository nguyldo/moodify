const Angry = require("../models/angry");
const Bad = require("../models/bad");
const Content = require("../models/content");
const Excited = require("../models/excited");
const Happy = require("../models/happy");
const Sad = require("../models/sad");
const song = require("../models/song");

// Request to mongo for song by mood and associated feels
// Returns list of song ids
async function getSongByMood(coreMood) {
  console.log("is it coming to here?");
    coreMood.toLowerCase();
    console.log("getting songs from " + coreMood);

    try {
      const songs = await Song.find({
        "moodTag": coreMood
      });
      return songs;
    } catch (error) {
      return error;
    }

}

module.export = { getSongByMood };