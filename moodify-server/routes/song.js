const express = require("express");
const Angry = require("../models/angry") //don't need
const Bad = require("../models/bad") //don't need
const Content = require("../models/content") //don't need
const Excited = require("../models/excited") //don't need
const Happy = require("../models/happy") //don't need
const Sad = require("../models/sad") //don't need

// Server Imports
const Song = require("../models/song")
const songRoutes = express.Router();
const axios = require('axios');

// Function Imports
let { getSongByMood } = require("../functions/mongoSong");

const spotify_url = 'https://api.spotify.com/v1';

// gets songs from Spotify's database based on user's search
// returns songs found in Spotify's database based on user's search
// https://localhost:5000/song/search?term={text_to_search}&type={track or album}&token={token}
songRoutes.get('/search', (req, res) => {
  const { term, type, token } = req.query;
  axios.get(spotify_url + '/search?q=' + term + '&type=' + type, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((data) => {
      console.log('successful search')
      //console.log(data.data.tracks.items)
      var items = data.data.tracks.items; //LEFT HERE
      var toReturn = [];
      items.forEach(element => {
        let rawArtists = element.artists;
        let artists = [];
        let artistUrl = []
        rawArtists.forEach(artist => {
          artists.push(artist.name)
          artistUrl.push(artist.external_urls.spotify)
        });

        toReturn.push({
          "songId": element.id,
          "songName": element.name,
          "songArtist": artists,
          "artistUrl": artistUrl,
          "songAlbum": element.album.name,
          "albumUrl": element.album.external_urls.spotify,
          "imageUrl": element.album.images[0].url,
          "genre": element.genre,
          "explicit": element.explicit,
          "popularity": element.popularity
        });
      });
      res.json(toReturn);
    })
    .catch((err) => {
      console.log('unsuccessful search')
      console.log(err);
    });
})

// gets all songs
// returns all songs from Moodify's Song table
// http://localhost:5000/song/all
songRoutes.get("/all", async (req, res) => {
  try {
    console.log("returning all songs");
    const songs = await Song.find();
    res.status(200).send(songs);
  } catch (error) {
    res.sendStatus(400)
  }
})

// get songs by mood
// returns all songs from that has a specific mood tag
// http://localhost:5000/song/:mood
songRoutes.get("/:mood", async (req, res) => {
  const { mood } = req.params;
  try {
    console.log("got here")
    // const songs = await getSongByMood(mood);
    const songs = await Song.find({
      "moodTag": mood
    });
    res.status(200).send(songs);
  } catch (error) {
    res.status(400);
  }
  // const songs = await Song.find({
  //   "moodTag": mood
  // });

  // res.status(200).send(songs);
})

// posts user's suggested song to Song table and respective mood tables, updates moodTags and respective mood tables if exist already
// { af1, af2, af3, af4, af5} are the optional associated feels, adminRec = true/false
// returns json message
// http://localhost:5000/song/post?mood={mood}&af1={af1}&af2={af2}&af3={af3}&af4={af4}&af5={af5}&adminRec={adminRec}
songRoutes.post("/post", async (req, res) => {
  const { mood, af1, af2, af3, af4, af5, adminRec } = req.query;
  let rec = true;
  if (adminRec != "true") {
    rec = false;
  }
  let associatedFeelsArr = checkAssociatedFeels(af1, af2, af3, af4, af5);
  console.log("associatedFeelsArr: " + associatedFeelsArr)
  const song = {
    "songId": req.body.songID,
    "songName": req.body.songName,
    "songArtist": req.body.songArtist,
    "artistUrl": req.body.artistURL,
    "songAlbum": req.body.songAlbum,
    "albumUrl": req.body.albumURL,
    "genre": req.body.genre,
    "moodTag": mood,
    "associatedFeels": associatedFeelsArr,
    "explicit": req.body.explicit,
    "popularity": req.body.popularity,
    "performedBy": req.body.performedBy,
    "writtenBy": req.body.writtenBy,
    "producedBy": req.body.producedBy,
    "adminRec": adminRec
  };

  if (await checkSong(song, mood, associatedFeelsArr)) {
    console.log("why am i here")
    await PostSong(song);
    console.log("why am i here2")
    res.json({
      "song was inserted": "into the db"
    });
  } else {
    res.json({
      "song was not inserted": "becuase it's in the db"
    });
  }
})

//DO NOT USE
// deletes song from specific mood table and updates song's moodTag in Song table
// returns json message
// http://localhost:5000/song/delete/mood?songID={songID}&mood={mood}
songRoutes.delete('/delete/mood', async(req, res) => {
  const { songID, mood } = req.query;
  try {
    console.log("deleting song");
    chooseDelete(songID, mood);
    console.log("song should be deleted")
    res.json(
      {"song deleted from": mood}
    );
  } catch (err) {
    return err;
  }
})

// delete song from Song table
// returns status code 200 if successful, status code if song does not exist
// https://localhost:5000/song/delete?songID={songID}
songRoutes.delete('/delete', async (req, res) => {
  const { songID } = req.query;
  try {
    await Song.findOne({"songID": songID})
    .then(async (data) => {
        if (data) {
          console.log("deleting this song")
          console.log("song: " + data.songName)
          await Song.findOneAndDelete({"songID": songID})
          res.sendStatus(200)
        } else {
          res.sendStatus(404)
        }
    });
  } catch (err) {
    return err
  }
})

//FUNCTIONS

function checkAssociatedFeels(af1, af2, af3, af4, af5) {
  try {
    let arr = [];

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
    await Song.findOne({"songID": songID})
    .then((data) => {
      if (data) {
        console.log(data.moodTag)
        var arr = []
        for (let i = 0; i < data.moodTag.length; i++) {
          if (data.moodTag[i] != mood) {
            arr.push(data.moodTag[i])
          }
        } //end for
        console.log("arr = " + arr)
        data.moodTag = arr;
        data.save()
        console.log("data.moodTag = " + data.moodTag)
        return
      }
    });
  } catch (err) {
    return err;
  }
}

async function checkSong(song, mood, associatedFeelsArr) {

  try {
    return await Song.findOne(
      { "songID": song.songID }
    ).then((data) => {
      if (data) { //song exists
        console.log(data)
        if (!data.moodTag.includes(mood)) { //if moodTag doesn't include new mood
          console.log("moodTag before: " + data.moodTag)
          console.log("assFeels before: " + data.associatedFeels)
          data.moodTag.push(mood);
          //check associatedFeelsTag
          for (let i = 0; i < associatedFeelsArr.length; i++) {
            if (!data.associatedFeels.includes(associatedFeelsArr[i])) {
              data.associatedFeels.push(associatedFeelsArr[i]);
            }
          } //end for
          data.save();
          console.log("moodTag after: " + data.moodTag)
          console.log("assFeels after: " + data.associatedFeels)
        } else { //exist already
          //console.log(mood + " is already part of this song's mood tag")
          //HERE IS WHERE YOU LEFT OFF
          //check associatedFeelsTag
          for (let i = 0; i < associatedFeelsArr.length; i++) {
            if (!data.associatedFeels.includes(associatedFeelsArr[i])) {
              data.associatedFeels.push(associatedFeelsArr[i]);
            }
          } //end for
          data.save();
          console.log("moodTag after: " + data.moodTag)
          console.log("assFeels after: " + data.associatedFeels)
        }
        return false;
      } else { //song don't exist yet
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
        "artistUrl": song.artistURL,
        "songAlbum": song.songAlbum,
        "albumUrl": song.albumURL,
        "genre": song.genre,
        "moodTag": song.moodTag,
        "associatedFeels": song.associatedFeels,
        "explicit": song.explicit,
        "popularity": song.popularity,
        "performedBy": song.performedBy,
        "writtenBy": song.writtenBy,
        "producedBy": song.producedBy,
        "adminRec": song.adminRec
      }
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
        console.log("why u sad")
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
      updateHappy(core)
      break;
    case 'sad':
      updateSad(core);
      console.log("why u sad")
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
      deleteHappy(songID)
      break;
    case 'sad':
      deleteSad(songID);
      console.log("why u sad")
      break;
  }
}

// HAPPY

async function PostHappy(core) {
  let arr = [];

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
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": arr,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateHappy(core) {
  try {
    return await Happy.findOne(
      { "songID": core.songID }
    ).then((data) => {
      if (data) {
        console.log(data)
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
          //data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          //data.save()
        }

        if (!data.associatedFeels.includes(core.af3) && core.af3 != null) {
          data.associatedFeels.push(core.af3);
          //data.save()
        }

        if (!data.associatedFeels.includes(core.af4) && core.af4 != null) {
          data.associatedFeels.push(core.af4);
          //data.save()
        }

        if (!data.associatedFeels.includes(core.af5) && core.af5 != null) {
          data.associatedFeels.push(core.af5);
          //data.save()
        }

        data.save()
        console.log(data.associatedFeels)
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function deleteHappy(songID) {
  try {
    await Happy.findOneAndDelete({"songID": songID})
    .then( async (data) => {
      if (data) {
        console.log(data)
        await removeMood(songID, "happy")
        res.json(data)
      }
    });
  } catch (err) {
    return err;
  }
}

// EXCITED

async function PostExcited(core) {
  let arr = [];

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
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": arr,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateExcited(core) {
  try {
    return await Excited.findOne(
      { "songID": core.songID }
    ).then((data) => {
      if (data) {
        console.log(data)
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
          //data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          //data.save()
        }

        if (!data.associatedFeels.includes(core.af3) && core.af3 != null) {
          data.associatedFeels.push(core.af3);
          //data.save()
        }

        if (!data.associatedFeels.includes(core.af4) && core.af4 != null) {
          data.associatedFeels.push(core.af4);
          //data.save()
        }

        if (!data.associatedFeels.includes(core.af5) && core.af5 != null) {
          data.associatedFeels.push(core.af5);
          //data.save()
        }

        data.save()
        console.log(data.associatedFeels)
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function deleteExcited(songID) {
  try {
    await Excited.findOneAndDelete({"songID": songID})
    .then( async (data) => {
      if (data) {
        console.log(data)
        await removeMood(songID, "excited")
        res.json(data)
      }
    });
  } catch (err) {
    return err;
  }
}

// CONTENT

async function PostContent(core) {
  let arr = [];

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
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": arr,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateContent(core) {
  try {
    return await Content.findOne(
      { "songID": core.songID }
    ).then((data) => {
      if (data) {
        console.log(data)
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

        data.save()
        console.log(data.associatedFeels)
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function deleteContent(songID) {
  try {
    await Content.findOneAndDelete({"songID": songID})
    .then( async (data) => {
      if (data) {
        console.log(data)
        await removeMood(songID, "content")
        res.json(data)
      }
    });
  } catch (err) {
    return err;
  }
}

// ANGRY

async function PostAngry(core) {
  let arr = [];

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
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": arr,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateAngry(core) {
  try {
    return await Angry.findOne(
      { "songID": core.songID }
    ).then((data) => {
      if (data) {
        console.log(data)
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

        data.save()
        console.log(data.associatedFeels)
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function deleteAngry(songID) {
  console.log("songID: "+ songID)
  try {
    await Angry.findOneAndDelete({"songID": songID})
    .then( async (data) => {
      console.log("data: "+ songID)
      if (data) {
        console.log("printing from angry")
        console.log(data)
        await removeMood(songID, "angry")
        console.log("deleting from angry")
        return;
      }
    });
  } catch (err) {
    return err;
  }
}

// BAD

async function PostBad(core) {
  let arr = [];

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
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": arr,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateBad(core) {
  try {
    return await Bad.findOne(
      { "songID": core.songID }
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

        data.save()
        console.log(data.associatedFeels)
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function deleteBad(songID) {
  try {
    await Content.findOneAndDelete({"songID": songID})
    .then( async (data) => {
      if (data) {
        console.log(data)
        await removeMood(songID, "bad")
        res.json(data)
      }
    });
  } catch (err) {
    return err;
  }
}

// SAD

async function PostSad(core) {
  let arr = [];

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
        "songID": core.songID,
        "songName": core.songName,
        "songURI": core.songURI,
        "associatedFeels": arr,
        "adminRec": core.adminRec,
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function updateSad(core) {
  try {
    return await Sad.findOne(
      { "songID": core.songID }
    ).then((data) => {
      if (data) {
        console.log(data)
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

        data.save()
        console.log(data.associatedFeels)
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function deleteSad(songID) {
  try {
    await Sad.findOneAndDelete({"songID": songID})
    .then( async (data) => {
      if (data) {
        console.log(data)
        await removeMood(songID, "sad")
        res.json(data)
      }
    });
  } catch (err) {
    return err;
  }
}

module.exports = songRoutes;