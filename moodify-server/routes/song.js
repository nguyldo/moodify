const express = require("express");
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

//currently not properly posting
// http://localhost:5000/song/post
songRoutes.post("/post", async (req, res) => {
  const song = new Song({
		songID: req.body.songID,
		songName: req.body.songName,
    songArtist: req.body.songArtist,
    songAlbum: req.body.songAlbum,
    moodTag: req.body.moodTag,
    listenings: req.body.listenings,
    performedBy: req.body.performedBy,
    writtenBy: req.body.writtenBy,
    producedBy: req.body.producedBy
	})
  await song.save();
  res.send(song)
  console.log(song)
})

module.exports = songRoutes;