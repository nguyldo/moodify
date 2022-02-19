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

// http://localhost:5000/song/post/:mood
songRoutes.post("/post/:mood", async (req, res) => {
  const mood = req.params;
  //const admin = true;
  const song = {
    "songID": req.body.songID,
    "songName": req.body.songName,
    "songArtist": req.body.songArtist,
    "songAlbum": req.body.songAlbum,
    "moodTag": mood,
    "popularity": req.body.popularity,
    "performedBy": req.body.performedBy,
    "writtenBy": req.body.writtenBy,
    "producedBy": req.body.producedBy
  };

  // if (adminRec == "false") {
  //   admin = false;
  // }

  const core = {
    "songID": req.body.songID,
    "songName": req.body.songName,
    "songURI": req.body.songURI,
    "associatedFeels": req.body.associatedFeels,
    "adminRec": req.body.adminRec,
  }

  if (await CheckSong(song, mood, core)) {
    console.log("why am i here")
    await PostSong(song);
    console.log("why am i here2")
    await chooseMood(mood, core);
    //await PostHappy(core);
    res.json({
      "song was inserted": "into the db"
    });
  } else {
    res.json({
      "song was not inserted": "becuase it's in the db"
    });
    console.log("hihihi")
    console.log(song);
  }
})

//delete song from mood, update moodTag in song
songRoutes.delete("/delete/:mood"), async (req, res) => {
  const mood = req.params;

}

//FUNCTIONS

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
        console.log("why u sad")
        break;
    }
}

async function PostHappy(core) {
  try {
    await new Happy(
      {
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": core.associatedFeels,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function PostExcited(core) {
  try {
    await new Excited(
      {
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": core.associatedFeels,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function PostContent(core) {
  try {
    await new Content(
      {
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": core.associatedFeels,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function PostAngry(core) {
  try {
    await new Angry(
      {
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": core.associatedFeels,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function PostBad(core) {
  try {
    await new Bad(
      {
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": core.associatedFeels,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function PostSad(core) {
  try {
    await new Sad(
      {
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": core.associatedFeels,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function CheckSong(song, mood, core) {

  try {
    return await Song.findOne(
      { "songID": song.songID }
    ).then((data) => {
      if (data) {
        console.log(data)
        if (!data.moodTag.includes(mood)) {
          chooseMood(mood, core);
          data.moodTag.push(mood);
          console.log(data.moodTag)
          data.save()
          console.log("inserting into "+ mood)
        } else {
          console.log(mood + " is already part of this song's mood tag")
        }
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