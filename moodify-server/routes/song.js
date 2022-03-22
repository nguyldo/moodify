<<<<<<< HEAD
const express = require('express');
const Angry = require('../models/angry');
const Bad = require('../models/bad');
const Content = require('../models/content');
const Excited = require('../models/excited');
const Happy = require('../models/happy');
const Sad = require('../models/sad');
const Song = require('../models/song');

const songRoutes = express.Router();
const axios = require('axios');
const song = require('../models/song');
=======
// Server Imports
const express = require("express");
const Song = require("../models/song")
const songRoutes = express.Router();
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd

// Function Imports
let { getSongByMood, postSong, checkSong, checkAssociatedFeels } = require("../functions/mongoSong");
let { searchSong, idsToTracks } = require('../functions/spotifySong');

// gets songs from Spotify's database based on user's search
// returns songs found in Spotify's database based on user's search
// https://localhost:5000/song/search?term={text_to_search}&type={track or album}&token={token}
songRoutes.get('/search', async (req, res) => {
  const { term, type, token } = req.query;
<<<<<<< HEAD
  axios.get(`${spotify_url}/search?q=${term}&type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((data) => {
      console.log('successful search');
      // console.log(data.data.tracks.items)
      const { items } = data.data.tracks; // LEFT HERE
      const toReturn = [];
      items.forEach((element) => {
        const rawArtists = element.artists;
        const artists = [];
        const artistURLs = [];
        rawArtists.forEach((artist) => {
          artists.push(artist.name);
          artistURLs.push(artist.external_urls.spotify);
        });

        toReturn.push({
          songID: element.id,
          songName: element.name,
          songArtist: artists,
          artistURL: artistURLs,
          songAlbum: element.album.name,
          albumURL: element.album.external_urls.spotify,
          genre: element.genre,
          explicit: element.explicit,
          popularity: element.popularity,
        });
      });
      res.json(toReturn);
    })
    .catch((err) => {
      console.log('unsuccessful search');
      console.log(err);
    });
});
=======
  try {
    res.status(200).send(await searchSong(term, type, token));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
})
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd

// gets all songs
// returns all songs from Moodify's Song table
// http://localhost:5000/song/all
<<<<<<< HEAD
songRoutes.get('/all', async (req, res) => {
  console.log('returning all songs');
  const songs = await Song.find();
  res.send(songs);
});
=======
songRoutes.get("/all", async (req, res) => {
  try {
    console.log("returning all songs");
    res.status(200).send(await Song.find());
  } catch (error) {
    res.sendStatus(400)
  }
})
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd

// get songs by mood
// returns all songs from that has a specific mood tag
// http://localhost:5000/song/:mood
songRoutes.get('/:mood', async (req, res) => {
  const { mood } = req.params;
<<<<<<< HEAD
  mood.toLowerCase();
  console.log(`getting songs from ${mood}`);

  const songs = await Song.find({
    moodTag: mood,
  });

  res.send(songs);

  // switch (mood) {
  //   case 'angry':
  //     res.send(await Angry.find());
  //     break;
  //   case 'bad':
  //     res.send(await Bad.find());
  //     break;
  //   case 'content':
  //     const temp = await Content.find();
  //     res.send(temp);
  //     break;
  //   case 'excited':
  //     res.send(await Excited.find());
  //     break;
  //   case 'happy':
  //     res.send(await Happy.find());
  //     break;
  //   case 'sad':
  //     res.send(await Sad.find());
  //     break;
  // }
});
=======
  try {
    res.status(200).send(await getSongByMood(mood));
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
})
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd

// posts user's suggested song to Song table, updates moodTags and associatedFeels if exists already
// { af1, af2, af3, af4, af5 } are the optional associated feels, adminRec = true/false
// returns json message
// http://localhost:5000/song/post?mood={mood}&af1={af1}&af2={af2}&af3={af3}&af4={af4}&af5={af5}&adminRec={adminRec}
<<<<<<< HEAD
songRoutes.post('/post', async (req, res) => {
  const {
    mood, af1, af2, af3, af4, af5, adminRec,
  } = req.query;
=======
songRoutes.post("/post", async (req, res) => {
  const { mood, af1, af2, af3, af4, af5, adminRec } = req.query;

>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
  let rec = true;
  if (adminRec != 'true') {
    rec = false;
  }
<<<<<<< HEAD
  const associatedFeelsArr = checkAssociatedFeels(af1, af2, af3, af4, af5);
  console.log(`associatedFeelsArr: ${associatedFeelsArr}`);
  const song = {
    songID: req.body.songID,
    songName: req.body.songName,
    songArtist: req.body.songArtist,
    artistURL: req.body.artistURL,
    songAlbum: req.body.songAlbum,
    albumURL: req.body.albumURL,
    genre: req.body.genre,
    moodTag: mood,
    associatedFeels: associatedFeelsArr,
    explicit: req.body.explicit,
    popularity: req.body.popularity,
    performedBy: req.body.performedBy,
    writtenBy: req.body.writtenBy,
    producedBy: req.body.producedBy,
    adminRec,
=======
  let associatedFeelsArr = checkAssociatedFeels(af1, af2, af3, af4, af5);
  console.log("associatedFeelsArr: " + associatedFeelsArr)

  const song = {
    "songId": req.body.songId,
    "songName": req.body.songName,
    "songArtist": req.body.songArtist,
    "artistUrl": req.body.artistUrl,
    "songAlbum": req.body.songAlbum,
    "albumUrl": req.body.albumUrl,
    "imageUrl": req.body.imageUrl,
    "moodTag": mood,
    "associatedFeels": associatedFeelsArr,
    "explicit": req.body.explicit,
    "popularity": req.body.popularity,
    "performedBy": req.body.performedBy,
    "writtenBy": req.body.writtenBy,
    "producedBy": req.body.producedBy,
    "adminRec": adminRec
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
  };

  console.log("song: " + song.songName);

  if (await checkSong(song, mood, associatedFeelsArr)) {
<<<<<<< HEAD
    console.log('why am i here');
    await PostSong(song);
    console.log('why am i here2');
    // await chooseMood(mood, core);
=======
    console.log("posting song")
    await postSong(song);
    console.log("posted song")
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
    res.json({
      'song was inserted': 'into the db',
    });
  } else {
    res.json({
<<<<<<< HEAD
      'song was not inserted': "becuase it's in the db",
=======
      "song was not inserted": "because it's in the db"
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
    });
  }
});

<<<<<<< HEAD
// DO NOT USE
// deletes song from specific mood table and updates song's moodTag in Song table
// returns json message
// http://localhost:5000/song/delete/mood?songID={songID}&mood={mood}
songRoutes.delete('/delete/mood', async (req, res) => {
  const { songID, mood } = req.query;
  try {
    console.log('deleting song');
    chooseDelete(songID, mood);
    console.log('song should be deleted');
    res.json(
      { 'song deleted from': mood },
    );
  } catch (err) {
    return err;
  }
});

// deletes song entities in Song table and its other entities in respective mood tables
=======
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
// delete song from Song table
// returns status code 200 if successful, status code 404 if song does not exist
// https://localhost:5000/song/delete?songID={songID}
songRoutes.delete('/delete', async (req, res) => {
  const { songID } = req.query;
  try {
    await Song.findOne({ songID })
      .then(async (data) => {
        if (data) {
<<<<<<< HEAD
          console.log('deleting this song');
          console.log(`song: ${data.songName}`);
          // console.log("delete from individual mood tables")
          // temp = data.moodTag.length
          // for (let i = 0; i < temp; i++) {
          //   chooseDelete(data.songID, data.moodTag[i]);
          // } //end for
          // console.log("moodTag now: " + data.moodTag)
          await Song.findOneAndDelete({ songID });
          res.sendStatus(200);
=======
          console.log("deleting this song")
          console.log("song: " + data.songName)
          await Song.findOneAndDelete({"songID": songID})
          res.sendStatus(200)
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
        } else {
          res.sendStatus(404);
        }
      });
  } catch (err) {
    return err;
  }
});

<<<<<<< HEAD
// FUNCTIONS

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

async function removeMood(songID, mood) {
  try {
    await Song.findOne({ songID })
      .then((data) => {
        if (data) {
          console.log(data.moodTag);
          const arr = [];
          for (let i = 0; i < data.moodTag.length; i++) {
            if (data.moodTag[i] != mood) {
              arr.push(data.moodTag[i]);
            }
          } // end for
          console.log(`arr = ${arr}`);
          data.moodTag = arr;
          data.save();
          console.log(`data.moodTag = ${data.moodTag}`);
        }
      });
  } catch (err) {
    return err;
  }
}

async function checkSong(song, mood, associatedFeelsArr) {
  try {
    return await Song.findOne(
      { songID: song.songID },
    ).then((data) => {
      if (data) { // song exists
        console.log(data);
        if (!data.moodTag.includes(mood)) { // if moodTag doesn't include new mood
          // chooseMood(mood, core);
          console.log(`moodTag before: ${data.moodTag}`);
          console.log(`assFeels before: ${data.associatedFeels}`);
          data.moodTag.push(mood);
          // check associatedFeelsTag
          for (let i = 0; i < associatedFeelsArr.length; i++) {
            if (!data.associatedFeels.includes(associatedFeelsArr[i])) {
              data.associatedFeels.push(associatedFeelsArr[i]);
            }
          } // end for
          data.save();
          console.log(`moodTag after: ${data.moodTag}`);
          console.log(`assFeels after: ${data.associatedFeels}`);
        } else { // exist already
          // console.log(mood + " is already part of this song's mood tag")
          // HERE IS WHERE YOU LEFT OFF
          // chooseAssociatedFeels(mood, core);
          // check associatedFeelsTag
          for (let i = 0; i < associatedFeelsArr.length; i++) {
            if (!data.associatedFeels.includes(associatedFeelsArr[i])) {
              data.associatedFeels.push(associatedFeelsArr[i]);
            }
          } // end for
          data.save();
          console.log(`moodTag after: ${data.moodTag}`);
          console.log(`assFeels after: ${data.associatedFeels}`);
        }
        return false;
      } // song don't exist yet
      return true;
    });
  } catch (err) {
    console.log(err);
  }
}

async function PostSong(song) {
  try {
    await new Song(
      {
        songID: song.songID,
        songName: song.songName,
        songArtist: song.songArtist,
        artistURL: song.artistURL,
        songAlbum: song.songAlbum,
        albumURL: song.albumURL,
        genre: song.genre,
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
  } catch (err) {
    console.log(err);
  }
}

async function chooseMood(mood, core) {
  switch (mood) {
    case 'angry':
      PostAngry(core);
      break;
    case 'bad':
      PostBad(core);
      break;
    case 'content':
      PostContent(core);
      break;
    case 'excited':
      PostExcited(core);
      break;
    case 'happy':
      PostHappy(core);
      break;
    case 'sad':
      PostSad(core);
      console.log('why u sad');
      break;
  }
}

async function chooseAssociatedFeels(mood, core) {
  switch (mood) {
    case 'angry':
      updateAngry(core);
      break;
    case 'bad':
      updateBad(core);
      break;
    case 'content':
      updateContent(core);
      break;
    case 'excited':
      updateExcited(core);
      break;
    case 'happy':
      updateHappy(core);
      break;
    case 'sad':
      updateSad(core);
      console.log('why u sad');
      break;
  }
}

async function chooseDelete(songID, mood) {
  switch (mood) {
    case 'angry':
      deleteAngry(songID);
      break;
    case 'bad':
      deleteBad(songID);
      break;
    case 'content':
      deleteContent(songID);
      break;
    case 'excited':
      deleteExcited(songID);
      break;
    case 'happy':
      deleteHappy(songID);
      break;
    case 'sad':
      deleteSad(songID);
      console.log('why u sad');
      break;
  }
}

// HAPPY

async function PostHappy(core) {
  const arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
  }

  if (core.af3 != null) {
    arr.push(core.af3);
  }

  if (core.af4 != null) {
    arr.push(core.af4);
  }

  if (core.af5 != null) {
    arr.push(core.af5);
  }

  try {
    await new Happy(
      {
        songID: core.songID,
        songName: core.songName,
        songURI: core.songURI,
        associatedFeels: arr,
        adminRec: core.adminRec,
      },
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateHappy(core) {
  try {
    return await Happy.findOne(
      { songID: core.songID },
    ).then((data) => {
      if (data) {
        console.log(data);
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
          // data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          // data.save()
        }

        if (!data.associatedFeels.includes(core.af3) && core.af3 != null) {
          data.associatedFeels.push(core.af3);
          // data.save()
        }

        if (!data.associatedFeels.includes(core.af4) && core.af4 != null) {
          data.associatedFeels.push(core.af4);
          // data.save()
        }

        if (!data.associatedFeels.includes(core.af5) && core.af5 != null) {
          data.associatedFeels.push(core.af5);
          // data.save()
        }

        data.save();
        console.log(data.associatedFeels);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteHappy(songID) {
  try {
    await Happy.findOneAndDelete({ songID })
      .then(async (data) => {
        if (data) {
          console.log(data);
          await removeMood(songID, 'happy');
          res.json(data);
        }
      });
  } catch (err) {
    return err;
  }
}

// EXCITED

async function PostExcited(core) {
  const arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
  }

  if (core.af3 != null) {
    arr.push(core.af3);
  }

  if (core.af4 != null) {
    arr.push(core.af4);
  }

  if (core.af5 != null) {
    arr.push(core.af5);
  }

  try {
    await new Excited(
      {
        songID: core.songID,
        songName: core.songName,
        songURI: core.songURI,
        associatedFeels: arr,
        adminRec: core.adminRec,
      },
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateExcited(core) {
  try {
    return await Excited.findOne(
      { songID: core.songID },
    ).then((data) => {
      if (data) {
        console.log(data);
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
          // data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          // data.save()
        }

        if (!data.associatedFeels.includes(core.af3) && core.af3 != null) {
          data.associatedFeels.push(core.af3);
          // data.save()
        }

        if (!data.associatedFeels.includes(core.af4) && core.af4 != null) {
          data.associatedFeels.push(core.af4);
          // data.save()
        }

        if (!data.associatedFeels.includes(core.af5) && core.af5 != null) {
          data.associatedFeels.push(core.af5);
          // data.save()
        }

        data.save();
        console.log(data.associatedFeels);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteExcited(songID) {
  try {
    await Excited.findOneAndDelete({ songID })
      .then(async (data) => {
        if (data) {
          console.log(data);
          await removeMood(songID, 'excited');
          res.json(data);
        }
      });
  } catch (err) {
    return err;
  }
}

// CONTENT

async function PostContent(core) {
  const arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
  }

  if (core.af3 != null) {
    arr.push(core.af3);
  }

  if (core.af4 != null) {
    arr.push(core.af4);
  }

  if (core.af5 != null) {
    arr.push(core.af5);
  }

  try {
    await new Content(
      {
        songID: core.songID,
        songName: core.songName,
        songURI: core.songURI,
        associatedFeels: arr,
        adminRec: core.adminRec,
      },
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateContent(core) {
  try {
    return await Content.findOne(
      { songID: core.songID },
    ).then((data) => {
      if (data) {
        console.log(data);
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
        }

        if (!data.associatedFeels.includes(core.af3) && core.af3 != null) {
          data.associatedFeels.push(core.af3);
        }

        if (!data.associatedFeels.includes(core.af4) && core.af4 != null) {
          data.associatedFeels.push(core.af4);
        }

        if (!data.associatedFeels.includes(core.af5) && core.af5 != null) {
          data.associatedFeels.push(core.af5);
        }

        data.save();
        console.log(data.associatedFeels);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteContent(songID) {
  try {
    await Content.findOneAndDelete({ songID })
      .then(async (data) => {
        if (data) {
          console.log(data);
          await removeMood(songID, 'content');
          res.json(data);
        }
      });
  } catch (err) {
    return err;
  }
}

// ANGRY

async function PostAngry(core) {
  const arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
  }

  if (core.af3 != null) {
    arr.push(core.af3);
  }

  if (core.af4 != null) {
    arr.push(core.af4);
  }

  if (core.af5 != null) {
    arr.push(core.af5);
  }

  try {
    await new Angry(
      {
        songID: core.songID,
        songName: core.songName,
        songURI: core.songURI,
        associatedFeels: arr,
        adminRec: core.adminRec,
      },
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateAngry(core) {
  try {
    return await Angry.findOne(
      { songID: core.songID },
    ).then((data) => {
      if (data) {
        console.log(data);
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
        }

        if (!data.associatedFeels.includes(core.af3) && core.af3 != null) {
          data.associatedFeels.push(core.af3);
        }

        if (!data.associatedFeels.includes(core.af4) && core.af4 != null) {
          data.associatedFeels.push(core.af4);
        }

        if (!data.associatedFeels.includes(core.af5) && core.af5 != null) {
          data.associatedFeels.push(core.af5);
        }

        data.save();
        console.log(data.associatedFeels);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteAngry(songID) {
  console.log(`songID: ${songID}`);
  try {
    await Angry.findOneAndDelete({ songID })
      .then(async (data) => {
        console.log(`data: ${songID}`);
        if (data) {
          console.log('printing from angry');
          console.log(data);
          await removeMood(songID, 'angry');
          console.log('deleting from angry');
        }
      });
  } catch (err) {
    return err;
  }
}

// BAD

async function PostBad(core) {
  const arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
  }

  if (core.af3 != null) {
    arr.push(core.af3);
  }

  if (core.af4 != null) {
    arr.push(core.af4);
  }

  if (core.af5 != null) {
    arr.push(core.af5);
  }

  try {
    await new Bad(
      {
        songID: core.songID,
        songName: core.songName,
        songURI: core.songURI,
        associatedFeels: arr,
        adminRec: core.adminRec,
      },
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateBad(core) {
  try {
    return await Bad.findOne(
      { songID: core.songID },
    ).then((data) => {
      if (data) {
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
        }

        if (!data.associatedFeels.includes(core.af3) && core.af3 != null) {
          data.associatedFeels.push(core.af3);
        }

        if (!data.associatedFeels.includes(core.af4) && core.af4 != null) {
          data.associatedFeels.push(core.af4);
        }

        if (!data.associatedFeels.includes(core.af5) && core.af5 != null) {
          data.associatedFeels.push(core.af5);
        }

        data.save();
        console.log(data.associatedFeels);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteBad(songID) {
  try {
    await Content.findOneAndDelete({ songID })
      .then(async (data) => {
        if (data) {
          console.log(data);
          await removeMood(songID, 'bad');
          res.json(data);
        }
      });
  } catch (err) {
    return err;
  }
}

// SAD

async function PostSad(core) {
  const arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
  }

  if (core.af3 != null) {
    arr.push(core.af3);
  }

  if (core.af4 != null) {
    arr.push(core.af4);
  }

  if (core.af5 != null) {
    arr.push(core.af5);
  }

  try {
    await new Sad(
      {
        songID: core.songID,
        songName: core.songName,
        songURI: core.songURI,
        associatedFeels: arr,
        adminRec: core.adminRec,
      },
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateSad(core) {
  try {
    return await Sad.findOne(
      { songID: core.songID },
    ).then((data) => {
      if (data) {
        console.log(data);
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
        }

        if (!data.associatedFeels.includes(core.af3) && core.af3 != null) {
          data.associatedFeels.push(core.af3);
        }

        if (!data.associatedFeels.includes(core.af4) && core.af4 != null) {
          data.associatedFeels.push(core.af4);
        }

        if (!data.associatedFeels.includes(core.af5) && core.af5 != null) {
          data.associatedFeels.push(core.af5);
        }

        data.save();
        console.log(data.associatedFeels);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteSad(songID) {
  try {
    await Sad.findOneAndDelete({ songID })
      .then(async (data) => {
        if (data) {
          console.log(data);
          await removeMood(songID, 'sad');
          res.json(data);
        }
      });
  } catch (err) {
    return err;
  }
}

module.exports = songRoutes;
=======
module.exports = songRoutes;
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
