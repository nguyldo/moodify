const express = require('express');
const axios = require('axios');

const router = express.Router();

const spotify_url = 'https://api.spotify.com/v1';

const User = require('../models/user');
const Mood = require('../models/mood');
const Angry = require("../models/angry")
const Bad = require("../models/bad")
const Content = require("../models/content")
const Excited = require("../models/excited")
const Happy = require("../models/happy")
const Sad = require("../models/sad")
const Song = require("../models/song")

// http://localhost:5000/user/{token}
// Get User Profile from Spotify
// Return Raw User Profile from Spotify
router.get('/:token', (req, res) => {
  console.log('running user profile api')
  const { token } = req.params;

  axios.get(spotify_url + '/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((data) => {
      console.log('successful user profile api')
      console.log(token);
      res.json(data.data);
    })
    .catch((err) => {
      console.log('unsuccessful user profile api')
      console.log(err);
    });
});

// https://localhost:5000/user/tracks/:token
// Get User's Top Tracks From Spotify
// Returns User's Top Tracks in form of DB Song
router.get('/tracks/:token', (req, res) => {
  console.log('running user top tracks');
  const { token } = req.params;

  axios.get(spotify_url + '/me/top/tracks', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got user top tracks!');
    var items = data.data.items;
    var toReturn = [];
    items.forEach(element => {
      toReturn.push({
        "songID": element.id,
        "songName": element.name,
        "songArtist": element.artists,
        "songAlbum": element.album.name,
        "moodTag": "",
        "popularity": element.popularity,
        "performedBy": element.artists,
        "writtenBy": element.artists,
        "producedBy": element.artists
      });
    });
    res.json(toReturn);
  }).catch((err) => {
    console.log('unsuccessful user top tracks')
    console.log(err)
  })
})

// https://localhost:5000/user/artists/:token
// Get User's Top Artists From Spotify
// Returns User's Top Artists by Name
router.get('/artists/:token', (req, res) => {
  console.log('running user top artists');
  const { token } = req.params;

  axios.get(spotify_url + '/me/top/artists', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got user top artists!');
    var items = data.data.items;
    var toReturn = [];
    items.forEach(element => {
      // console.log(element)
      toReturn.push({
        "id": element.id,
        "name": element.name,
        "genres": element.genres,
        "popularity": element.popularity,
        "followers": element.followers
      });
    });
    res.status(200).json(toReturn)
  }).catch((err) => {
    console.log('unsuccessful user top artists')
    console.log(err)
  })
})

// http://localhost:5000/user/dbprofile/{token}
// Gets User's Profile from mongo using Spotify API to get UserID
// Returns user's info from mongo
router.get('/dbprofile/:token', async (req, res) => {
  console.log('running user info database retrieval');
  const { token } = req.params;

  axios.get(spotify_url + '/me', {
    headers: { Authorization: `Bearer ${token}` }
  }).then((data) => {
    console.log('Got user profile from spotify');
    console.log(data.data.id);
    return findUser(data.data.id);
  }).then((data) => {
    console.log(data);
    res.json(data);
  }).catch((err) => {
    console.log(err);
  })
})

// http://localhost:5000/user/update/mood?type={core emotion}&token={token}
// Posts user's mood to mongo, updates the time and click count
// Returns status code
router.post('/update/mood', async (req, res) => {
  console.log('running user update mood info');
  const { type, token } = req.query;

  axios.get(spotify_url + '/me', {
    headers: { Authorization: `Bearer ${token}`}
  }).then((data) => {
    return checkMood(type, data.data.id);
  }).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
  })
})

//new user
//get info from spotify api after authentication
// http://localhost5000/user/post?id={userID}
router.post('/post', async (req, res) => {
  const { id } = req.query;

  const user = {
    "userID": id
  };

  if (await checkUser(user)) {
    await postUser(user);
    res.json({
      "user was inserted": "into the db"
    });
  } else {
    res.json({
      "user was not inserted": "becuase they already exist"
    });
    console.log(user);
  }
})

router.post('/logout', async (req, res) => {
  const { id } = req.query;

  try {
    return User.findOneAndUpdate(
      { "userID": id },
      { "loggedin": false }
    ).then((data) => {
      if (data) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
  } catch (err) {
    console.log(err);
  }
})

// route for updating user's recommendedSongIDs and numRecommendations
// https://localhost:5000/recommended?userID={userID}&songID={songID}
// Puts a recommended song into user's recommended list
// Returns status code
router.put('/recommended', async (req, res) =>  {
  const { userID, songID } = req.query;

  const user = {
    "userID" : userID,
    "songID" : songID
  };

  try {
    return await User.findOne(
      { "userID": user.userID }
    ).then((data) => {
      if (data) {
        console.log("hereeeeee")
        console.log(data)
        if (!data.recommendedSongIDs.includes(user.songID)) {
          data.recommendedSongIDs.push(user.songID);
          data.numRecommendations++;
          console.log(data)
          data.save()
          console.log("inserting new recommended song")
          res.sendStatus(200)
        } else {
          console.log("user already has this recommended song")
          //res.sendStatus(400)
        }
      }
    }).then(() => {
      // res.sendStatus(200)
    })
  } catch (err) {
    console.log(err);
  }
})

// http://localhost:5000/user/personal/{token}?cm={coremood}&am1={associatedmood}&am2={associatedmood}
router.get('/personal/:token', async (req, res) => {
  const { token } = req.params;
  const { cm, am1, am2 } = req.query;
  console.log("what the heck")
  try {
    // Grab User's Top Tracks
    userTracks = (await userTopTracks(token)).slice(0, 50).map((item) => {
      return item.songID;
    });
    // console.log(userTracks)

    // Grab Mongo's Mood & Associated Mood
    mongoTracks = (await getSongByMood(cm, am1, am2)).slice(0, 50).map((item) => {
      return item.songID;
    });
    // console.log(mongoTracks);

    // Concat User Tracks & Mongo Tracks
    combinedTracks = userTracks.concat(mongoTracks);
    // console.log(combinedTracks);

    // Collect Audio Features of User's Top Tracks
    trackFeatures = await audioFeatures(combinedTracks, token);
    // console.log(trackFeatures);

    // Filter User's Top Moods Using Mongo Songs
    filteredTracks = await filterTracks(userTracks, mongoTracks, trackFeatures);
    // console.log(filteredTracks);

    // Concat Filtered Tracks w/ Mongo's Tracks Randomly
    combinedTracks = mongoTracks.slice(0,2).concat(filteredTracks).slice(0,5);
    // console.log(combinedTracks);

    // Get Recommendations using User's & Mongo's
    recommendedTracks = await spotifyRecommend(combinedTracks, token);
    // console.log(recommendedTracks)

    // Concat the new recommended with the previously filtered
    combinedTracks = filteredTracks.concat(recommendedTracks);

    // Collect Audio Features from Spotify of the Tracks (Max 100)
    trackFeatures = await audioFeatures(combinedTracks, token);
    // console.log(trackFeatures)

    // Filter Recommendations Using the Filtered User's Songs
    personalizedTracks = (await filterTracks(filteredTracks, recommendedTracks, trackFeatures)).slice(0,5);

    // Get recommended tracks based the personalized tracks
    recommendedTracks = await spotifyRecommend(personalizedTracks, token);

    recommendedTracks = await idsToTracks(recommendedTracks, token);

    res.status(200).json(recommendedTracks);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
})

// Andrew Function's ATM, will be combined with the others soon

// Request to spotify for user's top tracks
// Returns list of ids of the user's top tracks
async function userTopTracks(token) {
  console.log('running user top tracks');

  return await axios.get(spotify_url + '/me/top/tracks', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got user top tracks!');
    var items = data.data.items;
    var toReturn = [];
    items.forEach(element => {
      toReturn.push({
        "songID": element.id,
        "songName": element.name,
        "songArtist": element.artists,
        "songAlbum": element.album.name,
        "moodTag": "",
      });
    });
    return toReturn;
  }).catch((err) => {
    console.log('unsuccessful user top tracks')
    console.log(err)
  })
}

// Request to mongo for song by mood and associated feels
// Returns list of song ids
async function getSongByMood(coreMood, associatedMood1, associatedMood2) {
  coreMood.toLowerCase();
  console.log("getting songs from " + coreMood);

  switch (coreMood) {
    case 'angry':
      return await Angry.find();
    case 'bad':
      return await Bad.find();
    case 'content':
      return await Content.find();
    case 'excited':
      return await Excited.find();
    case 'happy':
      return await Happy.find();
    case 'sad':
      return await Sad.find();
  }
}

// Request to spotify for audio features of list
// Returns list of audio features by song id
async function audioFeatures(list, token) {
  let str = list.join()
  return await axios.get(spotify_url + '/audio-features?ids=' + str, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got audio features!');
    return data.data;
  }).catch((err) => {
    console.log('Unsuccessful audio features!')
    console.log(err)
  })
}

// Uses features to filter 'toFilter' using 'list' features
// Returns list of song ids that were filtered
async function filterTracks(toFilter, list, features) {
  // console.log(list)
  list = features.audio_features.filter((item) => {
    if (item) return list.includes(item.id);
  })
  // console.log(list)

  // console.log(toFilter)
  toFilter = features.audio_features.filter((item) => {
    if (item) return toFilter.includes(item.id);
  })

  values = list.reduce((prev, curr) => {
    return {
      "tempo": (curr.tempo + prev.tempo) / 2,
      "energy": (curr.energy + prev.energy) / 2,
      "loudness": (curr.loudness + prev.loudness) / 2,
      "danceability": (curr.danceability + prev.danceability) / 2,
      "valence": (curr.valence + prev.valence) / 2,
      "liveness": (curr.liveness + prev.liveness) / 2,
    }
  })

  toFilter = toFilter.filter((item) => {
    dance = Math.abs(item.danceability - values.danceability) < 0.1;
    energy = Math.abs(item.energy - values.energy) < 0.5;
    loud = Math.abs(item.loudness - values.loudness) < 10;
    live = Math.abs(item.liveness - values.liveness) < 0.2;
    val = Math.abs(item.valence - values.valence) < 0.2;
    tempo = Math.abs(item.tempo - values.tempo) < 10;
    // console.log(item.id, tempo, energy, loud, dance, val, live);
    return tempo && energy && loud && dance && val && live;
  })

  if (toFilter.length == 0) {
    toFilter.push(list[0])
  }

  return toFilter.map(item => item.id)
}

// Request to spotify for new songs
// Returns json list of songs
async function spotifyRecommend(combinedTracks, token) {
  console.log('running spotify recommend');

  str = combinedTracks.join();

  return await axios.get(spotify_url + '/recommendations?seed_tracks=' + str, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got recommendations!');
    var items = data.data.tracks;
    var toReturn = [];
    items.forEach(element => {
      toReturn.push(element.id);
    });
    return toReturn;
  }).catch((err) => {
    console.log('unsuccessful recommendations')
    console.log(err)
  })
}

// Request to spotify for new songs
// Returns json list of songs
async function idsToTracks(combinedTracks, token) {
  console.log('running get tracks');

  str = combinedTracks.join();

  return await axios.get(spotify_url + '/tracks?ids=' + str, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got tracks!');
    var items = data.data.tracks;
    var toReturn = [];
    items.forEach(element => {
      toReturn.push({
        "songID": element.id,
        "songName": element.name,
        "songArtist": element.artists,
        "songAlbum": element.album.name,
        "moodTag": "",
      });
    });
    return toReturn;
  }).catch((err) => {
    console.log('unsuccessful get tracks')
    console.log(err)
  })
}

//FUNCTIONS

async function postUser(user) {
  try {
    await new User(
      {
        "userID": user.userID,
        "logins": 1,
        "numRecommendations": 0,
        "loggedin": true
      }
    ).save();
  } catch (err) {
    console.log(err);
  }
}


async function checkUser(user) {

  try {
    return await User.findOne(
      { "userID": user.userID }
    ).then((data) => {
      if (data) {
        // console.log(data)
        data.logins += 1;
        data.loggedin = true;
        data.save()
        return false;
      } else {
        return true;
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function findUser(userID) {
  try {
    let promise_obj = await User.findOne(
      { "userID": userID }//,
      //'userID logins',
    )
    console.log(promise_obj);
    return {
      "userID": promise_obj.userID,
      "logins": promise_obj.logins,
      "recommendedSongsIDs": promise_obj.recommendedSongIDs,
      "numRecommendations": promise_obj.numRecommendations
    };
  } catch (err) {
    console.log(err);
  }
}

// checks if mood is already in db and updates, if not it'll create it.
async function checkMood(mood, userID) {
  try {
    let promise_obj = await Mood.findOne(
      { "userID": userID, "type": mood }
    )
    if (promise_obj) {
      let arr = promise_obj.timeStamp;
      let timeNow = new Date();
      arr.push(timeNow.getTime());
      await Mood.updateOne(
        {
          "userID": userID,
          "type": mood
        },
        {
          "timeStamp": arr,
          "totalCount": promise_obj.totalCount + 1
        }
      )
    } else {
      let timeNow = new Date();
      let userMood = new Mood(
        {
          "userID": userID,
          "type": mood,
          "timeStamp": [timeNow.getTime()],
          "totalCount": 1,
        }
      )
      await userMood.save()
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = router;
