// Server Imports
const express = require('express');
const Song = require('../models/song');

const songRoutes = express.Router();

// Function Imports
const {
  getSongByMood, postSong, checkSong, checkAssociatedFeels,
} = require('../functions/mongoSong');
const { searchSong, idsToTracks } = require('../functions/spotifySong');

// gets songs from Spotify's database based on user's search
// returns songs found in Spotify's database based on user's search
// https://localhost:5000/song/search?term={text_to_search}&type={track or album}&token={token}
songRoutes.get('/search', async (req, res) => {
  const { term, type, token } = req.query;
  try {
    res.status(200).send(await searchSong(term, type, token));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// gets all songs
// returns all songs from Moodify's Song table
// http://localhost:5000/song/all
songRoutes.get('/all', async (req, res) => {
  try {
    console.log('returning all songs');
    res.status(200).send(await Song.find());
  } catch (error) {
    res.sendStatus(400);
  }
});

// get songs by mood
// returns all songs from that has a specific mood tag
// http://localhost:5000/song/:mood
songRoutes.get('/:mood', async (req, res) => {
  const { mood } = req.params;
  try {
    res.status(200).send(await getSongByMood(mood));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// posts user's suggested song to Song table, updates moodTags and associatedFeels if exists already
// { af1, af2, af3, af4, af5 } are the optional associated feels, adminRec = true/false
// returns json message
// http://localhost:5000/song/post?mood={mood}&af1={af1}&af2={af2}&af3={af3}&af4={af4}&af5={af5}&adminRec={adminRec}
songRoutes.post('/post', async (req, res) => {
  const {
    mood, af1, af2, af3, af4, af5, adminRec,
  } = req.query;

  let rec = true;
  if (adminRec != 'true') {
    rec = false;
  }
  const associatedFeelsArr = checkAssociatedFeels(af1, af2, af3, af4, af5);
  console.log(`associatedFeelsArr: ${associatedFeelsArr}`);

  const song = {
    songId: req.body.songId,
    songName: req.body.songName,
    songArtist: req.body.songArtist,
    artistUrl: req.body.artistUrl,
    songAlbum: req.body.songAlbum,
    albumUrl: req.body.albumUrl,
    imageUrl: req.body.imageUrl,
    moodTag: mood,
    associatedFeels: associatedFeelsArr,
    explicit: req.body.explicit,
    popularity: req.body.popularity,
    performedBy: req.body.performedBy,
    writtenBy: req.body.writtenBy,
    producedBy: req.body.producedBy,
    adminRec,
  };

  console.log(`song: ${song.songName}`);

  if (await checkSong(song, mood, associatedFeelsArr)) {
    console.log('posting song');
    await postSong(song);
    console.log('posted song');
    res.json({
      'song was inserted': 'into the db',
    });
  } else {
    res.json({
      'song was not inserted': "because it's in the db",
    });
  }
});

// delete song from Song table
// returns status code 200 if successful, status code 404 if song does not exist
// https://localhost:5000/song/delete?songID={songID}
songRoutes.delete('/delete', async (req, res) => {
  const { songID } = req.query;
  try {
    await Song.findOne({ songID })
      .then(async (data) => {
        if (data) {
          console.log('deleting this song');
          console.log(`song: ${data.songName}`);
          await Song.findOneAndDelete({ songID });
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      });
  } catch (err) {
    return err;
  }
});

module.exports = songRoutes;
