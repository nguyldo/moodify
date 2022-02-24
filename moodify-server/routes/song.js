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
const song = require("../models/song");

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

//af1 & af1 are the optional associated feels
// http://localhost:5000/song/post/?mood={mood}&af1={af1}&af2={af2}&adminRec={adminRec}
songRoutes.post("/post", async (req, res) => {
  const { mood, af1, af2, adminRec } = req.query;
  let rec = true;
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

  if (adminRec != "true") {
    rec = false;
  }

  const core = {
    "songID": req.body.songID,
    "songName": req.body.songName,
    "songURI": req.body.songURI,
    "af1": af1,
    "af2": af2,
    "adminRec": rec
  }

  if (await CheckSong(song, mood, core)) {
    console.log("why am i here")
    await PostSong(song);
    console.log("why am i here2")
    await chooseMood(mood, core);
    res.json({
      "song was inserted": "into the db"
    });
  } else {
    res.json({
      "song was not inserted": "becuase it's in the db"
    });
  }
})

// http://localhost:5000/song/delete?songID={songID}&mood={mood}
songRoutes.delete('/delete', async(req, res) => {
  const { songID, mood } = req.query;
  try {
    console.log("deleting song");
    chooseDelete(songID, mood);
    console.log("song should be deleted")
    // await Angry.findOneAndDelete({"songID": songID})
    // .then( async (data) => {
    //   if (data) {
    //     console.log(data)
    //     await removeMood(songID, mood)
    //     console.log("back from remove mood")
    //     res.json(data)
    //   }
    // });
    res.json(
      {"song deleted from": mood}
    );
  } catch (err) {
    return err;
  }
})

//FUNCTIONS

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

async function CheckSong(song, mood, core) {

  try {
    return await Song.findOne(
      { "songID": song.songID }
    ).then((data) => {
      if (data) {
        console.log(data)
        if (!data.moodTag.includes(mood)) { //if song doesn't exist in mood table yet
          chooseMood(mood, core);
          data.moodTag.push(mood);
          console.log(data.moodTag)
          data.save()
          console.log("inserting into " + mood)
        } else { //exist already
          console.log(mood + " is already part of this song's mood tag")
          //HERE IS WHERE YOU LEFT OFF
          chooseAssociatedFeels(mood, core);
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

async function PostHappy(core) {
  let arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
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
          data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          data.save()
        }
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

async function PostExcited(core) {
  let arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
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
          data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          data.save()
        }
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

async function PostContent(core) {
  let arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
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
          data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          data.save()
        }
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

async function PostAngry(core) {
  let arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
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
          data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          data.save()
        }
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
        //res.json(data)
      }
    });
  } catch (err) {
    return err;
  }
}

async function PostBad(core) {
  let arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
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
        console.log(data)
        if (!data.associatedFeels.includes(core.af1) && core.af1 != null) {
          data.associatedFeels.push(core.af1);
          data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          data.save()
        }
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

async function PostSad(core) {
  let arr = [];

  if (core.af1 != null) {
    arr.push(core.af1);
  }

  if (core.af2 != null) {
    arr.push(core.af2);
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
          data.save()
        }

        if (!data.associatedFeels.includes(core.af2) && core.af2 != null) {
          data.associatedFeels.push(core.af2);
          data.save()
        }
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