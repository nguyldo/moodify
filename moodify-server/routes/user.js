/*
** Current to do on back-end is throwing errors in the try-catches
** based on the return value of the functions.
*/
// Server Imports
const express = require('express');

const router = express.Router();

// Function Imports
const {
  postUser, findUser, checkUser, logout, saveUser,
} = require('../functions/mongoUser');
const { checkMood } = require('../functions/mongoMood');
const { checkPlaylistFollow } = require('../functions/spotifyPlaylist');
const {
  getUserId, getPlaylistFollow, userTop, getUserProfile, followArtist, followAlbum,
} = require('../functions/spotifyUser');

// Get User Profile from Spotify
// Return Raw User Profile from Spotify
// http://localhost:5000/user/{token}
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

// Get User's Top Tracks From Spotify
// Returns User's Top Tracks in form of DB Song
// https://localhost:5000/user/tracks/:token
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

// Get User's Top Artists From Spotify
// Returns User's Top Artists by Name
// https://localhost:5000/user/artists/:token
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

// Gets User's Profile from mongo using Spotify API to get UserID
// Returns user's info from mongo
// http://localhost:5000/user/dbprofile/{token}
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

// Posts user's mood to mongo, updates the time, and click count
// Returns status code
// http://localhost:5000/user/update/mood?type={core emotion}&token={token}
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
// http://localhost:5000/user/post?id={id}
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

// updates user's recommendedSongIds and numRecommendations
// Returns status code 200 if successful, status code 400 if unsuccessful
// https://localhost:5000/user/recommended?userId={userId}&songId={songId}
router.put('/recommended', async (req, res) => {
  const { userId, songId } = req.query;

  const user = {
    userId,
    songId,
  };

  try {
    let data = await findUser(user.userId);
    if (data) {
      // console.log(data.recommendedSongIds);
      if (!data.recommendedSongIds.includes(user.songId)) {
        data.recommendedSongIds.push(user.songId);
        data.numRecommendations += 1;
        data = await saveUser(data);
        // console.log(data);
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

// adds user as a follower of an artist on their Spotify account
// returns 200 if successul, 400 if unsuccessfull
// http://localhost:5000/user/follow/artist?id={id}&token={token}
router.put('/follow/artist', async (req, res) => {
  const { id, token } = req.query;

  try {
    await followArtist(id, token);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// saves an album to user's albums in their Spotify Account
// returns 200 if successul, 400 if unsuccessfull
// http://localhost:5000/user/follow/artist?id={id}&token={token}
router.put('/follow/album', async (req, res) => {
  const { id, token } = req.query;

  try {
    await followAlbum(id, token);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

module.exports = router;
