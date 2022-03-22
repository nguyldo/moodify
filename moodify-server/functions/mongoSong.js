const Angry = require('../models/angry');
const Bad = require('../models/bad');
const Content = require('../models/content');
const Excited = require('../models/excited');
const Happy = require('../models/happy');
const Sad = require('../models/sad');

// Request to mongo for song by mood and associated feels
// Returns list of song ids
async function getSongByMood(coreMood) {
  coreMood.toLowerCase();
  console.log(`getting songs from ${coreMood}`);

  switch (coreMood) {
    case 'angry':
      return Angry.find();
    case 'bad':
      return Bad.find();
    case 'content':
      return Content.find();
    case 'excited':
      return Excited.find();
    case 'happy':
      return Happy.find();
    case 'sad':
      return Sad.find();
    default:
      return undefined;
  }
}

module.export = { getSongByMood };
