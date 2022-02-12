const express = require("express");
const Song = require("../models/song")
const songRoutes = express.Router();

// Get all songs
songRoutes.get("/song", async (req, res) => {
  console.log("hello");
  const songs = await Song.find();
  res.send(songs);
})

//currently not properly posting
songRoutes.post("/createSong", async (req, res) => {
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