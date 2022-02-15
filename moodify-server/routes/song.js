const express = require("express");
const Angry = require("../models/angry")
const Bad = require("../models/bad")
const Content = require("../models/content")
const Excited = require("../models/excited")
const Happy = require("../models/happy")
const Sad = require("../models/sad")
const Song = require("../models/song")
const songRoutes = express.Router();
const axios = require('axios');

const spotify_url = 'https://api.spotify.com/v1';

// https://localhost:5000/song/search?term={text_to_search}&type={track or album}&token={token}
songRoutes.get('/search', (req, res) => {
  const { term, type, token } = req.query;
  axios.get(spotify_url + '/search?q=' + term + '&type=' + type, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((data) => {
      console.log('successful search')
      res.json(data.data);
    })
    .catch((err) => {
      console.log('unsuccessful search')
      console.log(err);
    });
})

// Get all songs
// http://localhost:5000/song/all
songRoutes.get("/all", async (req, res) => {
  console.log("hello");
  const songs = await Song.find();
  res.send(songs);
})

// get song by mood
// http://localhost:5000/song/:mood
songRoutes.get("/:mood", async (req, res) => {
  const { mood } = req.params;
  mood.toLowerCase();
  console.log("getting songs from " + mood);

  switch (mood) {
    case 'angry':
      res.send(await Angry.find());
      break;
    case 'bad':
      res.send(await Bad.find());
      break;
    case 'content':
      const temp = await Content.find();
      res.send(temp);
      break;
    case 'excited':
      res.send(await Excited.find());
      break;
    case 'happy':
      res.send(await Happy.find());
      break;
    case 'sad':
      res.send(await Sad.find());
      break;
  }
})

// http://localhost:5000/song/post
// weirdly this is connected to the 'songs' collection, not the 'Song' collection
songRoutes.post("/post", async (req, res) => {
  const song = {
    "songID": req.body.songID,
    "songName": req.body.songName,
    "songArtist": req.body.songArtist,
    "songAlbum": req.body.songAlbum,
    "moodTag": req.body.moodTag,
    "popularity": req.body.popularity,
    "performedBy": req.body.performedBy,
    "writtenBy": req.body.writtenBy,
    "producedBy": req.body.producedBy
  };
  if (await CheckSong(song)) {
    console.log("why am i here")
    await PostSong(song);
    res.json({
      "song was inserted": "into the db"
    });
  } else {
    res.json({
      "song was not inserted": "becuase it's in the db"
    });
  }
})

async function CheckSong(song) {
  try {
    return await Song.findOne(
      { "songID": song.songID }
    ).then((data) => {
      if (data) {
        return false;
      } else {
        return true;
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function PostSong(song) {
  try {
    await new Song(
      {
        "songID": song.songID,
        "songName": song.songName,
        "songArtist": song.songArtist,
        "songAlbum": song.songAlbum,
        "moodTag": song.moodTag,
        "popularity": song.popularity,
        "performedBy": song.performedBy,
        "writtenBy": song.writtenBy,
        "producedBy": song.producedBy
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

module.exports = songRoutes;