const express = require('express');
const axios = require('axios');

const router = express.Router();

const spotify_url = 'https://api.spotify.com/v1';

const User = require('../models/user');
const { json } = require('body-parser');
const { query } = require('express');

//http://localhost:5000/user/{token}
router.get('/:token', (req, res) => {
  console.log('running user profile api')
  const { token } = req.params;

  axios.get(spotify_url + '/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((data) => {
      console.log('successful user profile api')
      res.json(data.data);
    })
    .catch((err) => {
      console.log('unsuccessful user profile api')
      console.log(err);
    });
});

// https://localhost:5000/user/tracks/:token
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

// http://localhost:5000/user/dbprofile/{token}
router.get('/dbprofile/:token', async function(req, res) {
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

// for some reason is connected to the collection 'users' and not 'User'
async function findUser(userID) {
  try {
    let promise_obj = await User.findOne(
      { "userID": userID },
      'userID logins',
    )
    console.log(promise_obj);
    return {
      "userID": promise_obj.userID,
      "logins": promise_obj.logins
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
