/*
** Current to do on back-end is throwing errors in the try-catches
** based on the return value of the functions.
*/
// Server Imports
const express = require('express');

const router = express.Router();

// Function Imports
const { checkPlaylistFollow } = require('../functions/spotifyPlaylist');
const {
  getUserId, getPlaylistFollow, userTop, getUserProfile,
} = require('../functions/spotifyUser');
const {
  audioFeatures, idsToTracks, spotifyRecommend, filterTracks,
} = require('../functions/spotifySong');
const { getSongByMood } = require('../functions/mongoSong');
const {
  postUser, findUser, checkUser, logout, saveUser,
} = require('../functions/mongoUser');
const { checkMood } = require('../functions/mongoMood');

// http://localhost:5000/user/{token}
// Get User Profile from Spotify
// Return Raw User Profile from Spotify
router.get('/:token', async (req, res) => {
  console.log('running user profile api');
  const { token } = req.params;
  try {
    res.status(200).send(await getUserProfile(token));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// https://localhost:5000/user/tracks/:token
// Get User's Top Tracks From Spotify
// Returns User's Top Tracks in form of DB Song
router.get('/tracks/:token', async (req, res) => {
  console.log('running user top tracks');
  const { token } = req.params;

  try {
    res.status(200).send(await userTop(token, 'tracks'));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// https://localhost:5000/user/artists/:token
// Get User's Top Artists From Spotify
// Returns User's Top Artists by Name
router.get('/artists/:token', async (req, res) => {
  console.log('running user top artists');
  const { token } = req.params;
  try {
    res.status(200).send(await userTop(token, 'artists'));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// http://localhost:5000/user/dbprofile/{token}
// Gets User's Profile from mongo using Spotify API to get UserID
// Returns user's info from mongo
router.get('/dbprofile/:token', async (req, res) => {
  console.log('running user info database retrieval');
  const { token } = req.params;

  try {
    const id = await getUserId(token);
    res.status(200).send(await findUser(id));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// http://localhost:5000/user/update/mood?type={core emotion}&token={token}
// Posts user's mood to mongo, updates the time and click count
// Returns status code
router.post('/update/mood', async (req, res) => {
  console.log('running user update mood info');
  const { type, token } = req.query;

  try {
    const id = await getUserId(token);
    res.status(200).send(await checkMood(type, id));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// new user
// get info from spotify api after authentication
// http://localhost5000/user/post?id={userID}
router.post('/post', async (req, res) => {
  const { id } = req.query;

  const user = {
    userId: id,
  };

  try {
    if (await checkUser(user)) {
      await postUser(user); // TODO: Figure out how to error throw this function
      res.status(200).send('User Successfully Added');
    } else res.status(200).send('User Already Exists');
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post('/logout', async (req, res) => {
  const { id } = req.query;

  try {
    res.status(200).send(await logout(id));
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

// route for updating user's recommendedSongIDs and numRecommendations
// https://localhost:5000/recommended?userID={userID}&songID={songID}
// Puts a recommended song into user's recommended list
// Returns status code
router.put('/recommended', async (req, res) => {
  const { userId, songId } = req.query;

  const user = {
    userId,
    songId,
  };

  try {
    let data = await findUser(user.userId);
    if (data) {
      console.log(data.recommendedSongIds);
      if (!data.recommendedSongIds.includes(user.songId)) {
        data.recommendedSongIds.push(user.songId);
        data.numRecommendations++;
        data = await saveUser(data);
        console.log(data);
        console.log('inserting new recommended song');
        res.sendStatus(200);
      } else {
        console.log('user already has this recommended song');
        res.sendStatus(400);
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// http://localhost:5000/user/plalists/{token}?playlist={playlist_id}
router.get('/playlists/:token', async (req, res) => {
  const { token } = req.params;
  const { playlist } = req.query;

  if (playlist) {
    try {
      const id = await getUserId(token);
      res.status(200).send(await checkPlaylistFollow(playlist, id, token));
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  } else {
    const toReturn = await getPlaylistFollow(token);
    if (toReturn) res.status(200).send(toReturn);
    else res.sendStatus(400);
  }
});

// http://localhost:5000/user/personal/{token}?cm={coremood}&am1={associatedmood}&am2={associatedmood}
router.get('/personal/:token', async (req, res) => {
  const { token } = req.params;
  const { cm } = req.query;
  try {
    // Grab User's Top Tracks
    const userTracks = (await userTop(token, 'tracks')).slice(0, 50).map((item) => item.songID);
    // console.log(userTracks)

    // Grab Mongo's Mood & Associated Mood
    const mongoTracks = (await getSongByMood(cm)).slice(0, 50).map((item) => item.songID);
    // console.log(mongoTracks);

    // Concat User Tracks & Mongo Tracks
    let combinedTracks = userTracks.concat(mongoTracks);
    // console.log(combinedTracks);

    // Collect Audio Features of User's Top Tracks
    let trackFeatures = await audioFeatures(combinedTracks, token);
    // console.log(trackFeatures);

    // Filter User's Top Moods Using Mongo Songs
    const filteredTracks = await filterTracks(userTracks, mongoTracks, trackFeatures);
    // console.log(filteredTracks);

    // Concat Filtered Tracks w/ Mongo's Tracks Randomly
    combinedTracks = mongoTracks.slice(0, 2).concat(filteredTracks).slice(0, 5);
    // console.log(combinedTracks);

    // Get Recommendations using User's & Mongo's
    let recommendedTracks = await spotifyRecommend(combinedTracks, token);
    // console.log(recommendedTracks)

    // Concat the new recommended with the previously filtered
    combinedTracks = filteredTracks.concat(recommendedTracks);

    // Collect Audio Features from Spotify of the Tracks (Max 100)
    trackFeatures = await audioFeatures(combinedTracks, token);
    // console.log(trackFeatures)

    // Filter Recommendations Using the Filtered User's Songs
    const personalizedTracks = (await filterTracks(
      filteredTracks,
      recommendedTracks,
      trackFeatures,
    )).slice(0, 5);

    // Get recommended tracks based the personalized tracks
    recommendedTracks = await spotifyRecommend(personalizedTracks, token);

    recommendedTracks = await idsToTracks(recommendedTracks, token);

    res.status(200).json(recommendedTracks);
  } catch (error) {
    // console.log(error);
    res.status(400);
  }
});

module.exports = router;
