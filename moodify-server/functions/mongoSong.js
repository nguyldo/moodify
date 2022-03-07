const Angry = require("../models/angry");
const Bad = require("../models/bad");
const Content = require("../models/content");
const Excited = require("../models/excited");
const Happy = require("../models/happy");
const Sad = require("../models/sad");

// Request to mongo for song by mood and associated feels
// Returns list of song ids
async function getSongByMood(coreMood, associatedMood1, associatedMood2) {
    coreMood.toLowerCase();
    console.log("getting songs from " + coreMood);

    switch (coreMood) {
      case 'angry':
        return await Angry.find();
      case 'bad':
        return await Bad.find();
      case 'content':
        return await Content.find();
      case 'excited':
        return await Excited.find();
      case 'happy':
        return await Happy.find();
      case 'sad':
        return await Sad.find();
    }
}

module.export = { getSongByMood };