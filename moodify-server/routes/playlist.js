const express = require('express');
const axios = require('axios');

const Angry = require('../models/angry');
const Bad = require('../models/bad');
const Content = require('../models/content');
const Excited = require('../models/excited');
const Happy = require('../models/happy');
const Sad = require('../models/sad');

const router = express.Router();

const spotifyUrl = 'https://api.spotify.com/v1';

router.post('/recommendations', async (req, res) => {
  const { mood, associatedFeels, token } = req.body;

  let allSongs = [];
  switch (mood) {
    case 'angry':
      allSongs = await Angry.find();
      break;
    case 'bad':
      allSongs = await Bad.find();
      break;
    case 'content':
      allSongs = await Content.find();
      break;
    case 'excited':
      allSongs = await Excited.find();
      break;
    case 'happy':
      allSongs = await Happy.find();
      break;
    case 'sad':
      allSongs = await Sad.find();
      break;
    default:
      break;
  }

  let filteredSongs = [];
  if (associatedFeels.length > 0) {
    allSongs.map((song) => {
      for (const moodTag of song.associatedFeels) {
        if (associatedFeels.includes(moodTag)) {
          filteredSongs.push(song);
          break;
        }
      }
    });
  } else {
    filteredSongs = allSongs;
  }

  console.log(filteredSongs);
  let seedTracks = '';

  if (filteredSongs.length <= 5) {
    filteredSongs.map((song) => {
      seedTracks = `${seedTracks},${song.songID}`;
    });

    seedTracks = seedTracks.slice(1);

    const params = {
      seedTracks,
      limit: 30,
    };

    axios.get(`${spotifyUrl}/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
      .then((data) => {
        console.log(data.data.tracks);
        res.json(data.data.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
        })));
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  } else {
    const requests = [];
    for (let i = 0; i < 6; i += 1) {
      const randomIndices = [];
      while (randomIndices.length < 5) {
        const randomNumber = Math.floor(Math.random() * filteredSongs.length);
        if (!randomIndices.includes(randomIndices)) randomIndices.push(randomNumber);
      }

      for (const j of randomIndices) {
        seedTracks = `${seedTracks},${filteredSongs[j].songID}`;
      }

      seedTracks = seedTracks.slice(1);

      requests.push(
        axios.get(`${spotifyUrl}/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            seedTracks,
            limit: 5,
          },
        }),
      );
    }

    axios.all(requests)
      .then(axios.spread((...responses) => {
        const result = [];
        for (const response of responses) {
          response.data.tracks.map((track) => {
            const filteredTrack = {
              id: track.id,
              name: track.name,
              artists: track.artists.map((artist) => artist.name),
            };
            if (!result.includes(filteredTrack)) result.push(filteredTrack);
          });
        }

        res.json(result);
      }));
  }
});

module.exports = router;
