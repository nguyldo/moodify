const Song = require('../models/song');

// Request to mongo for song by mood and associated feels
// Returns list of song ids
async function getSongByMood(coreMood) {
  coreMood.toLowerCase();
  console.log(`getting songs for ${coreMood}`);

  try {
    const songs = await Song.find({
      moodTag: coreMood,
    });
    return songs;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// creates a new Song entity
// returns new Song entity
async function postSong(song) {
  console.log('getting to post');
  try {
    await new Song(
      {
        songId: song.songId,
        songName: song.songName,
        songArtist: song.songArtist,
        artistUrl: song.artistUrl,
        songAlbum: song.songAlbum,
        albumUrl: song.albumUrl,
        imageUrl: song.imageUrl,
        moodTag: song.moodTag,
        associatedFeels: song.associatedFeels,
        explicit: song.explicit,
        popularity: song.popularity,
        performedBy: song.performedBy,
        writtenBy: song.writtenBy,
        producedBy: song.producedBy,
        adminRec: song.adminRec,
      },
    ).save();
  } catch (error) {
    console.log(error);
    return error;
  }
}

// inserts a new associated feels if it does not yet exist in Song entity's associatedFeels array
// returns new/updated array
function insertAssociatedFeels(oriArr, newArr) {
  for (let i = 0; i < newArr.length; i += 1) {
    if (!oriArr.includes(newArr[i])) {
      oriArr.push(newArr[i]);
    }
  }
  return oriArr;
}

// checks if Song entity exists in the database, updates core mood and associated feels if exist
// returns true/false if Song entity exists
async function checkSong(song, mood, associatedFeelsArr) {
  try {
    return await Song.findOne(
      { songId: song.songId },
    ).then((data) => {
      if (data) { // song exists
        console.log(`dataaaaaa: ${data.songId}`);
        if (!data.moodTag.includes(mood)) { // if moodTag doesn't include mood
          // console.log(`moodTag before: ${data.moodTag}`);
          // console.log(`assFeels before: ${data.associatedFeels}`);

          data.moodTag.push(mood);

          // check associatedFeelsTag
          data.associatedFeels = insertAssociatedFeels(data.associatedFeels, associatedFeelsArr);

          data.save();

          // console.log(`moodTag after: ${data.moodTag}`);
          // console.log(`assFeels after: ${data.associatedFeels}`);
        } else { // exist already but still wanna check assTag
          // check associatedFeelsTag
          data.associatedFeels = insertAssociatedFeels(data.associatedFeels, associatedFeelsArr);

          data.save();
          // console.log(`moodTag after: ${data.moodTag}`);
          // console.log(`assFeels after: ${data.associatedFeels}`);
        }
        return false;
      } // song don't exist yet
      console.log("song doesn't exist yet so will insert");
      return true;
    });
  } catch (err) {
    console.log(err);
  }
}

// checks if associated feels are not null, inserts into array if not null
// returns associatedFeels array
function checkAssociatedFeels(af1, af2, af3, af4, af5) {
  try {
    const arr = [];

    if (af1 != null) {
      arr.push(af1);
    }
    if (af2 != null) {
      arr.push(af2);
    }
    if (af3 != null) {
      arr.push(af3);
    }
    if (af4 != null) {
      arr.push(af4);
    }
    if (af5 != null) {
      arr.push(af5);
    }
    return arr;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getSongByMood, postSong, checkSong, checkAssociatedFeels,
};
