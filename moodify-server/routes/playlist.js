const express = require('express');
const axios = require('axios');

const Song = require('../models/song');

const router = express.Router();

const spotifyUrl = 'https://api.spotify.com/v1';

router.post('/recommendations', async (req, res) => {
  const { mood, associatedFeels, token } = req.body;

  const allSongs = await Song.find({ moodTag: { $in: [mood] }, songId: { $exists: true } });

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
      seedTracks = `${seedTracks},${song.songId}`;
    });

    seedTracks = seedTracks.slice(1);

    const params = {
      seed_tracks: seedTracks,
      limit: 30,
    };

    axios.get(`${spotifyUrl}/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
      .then((data) => {
        console.log('2');
        console.log(data.data.tracks);
        console.log('2');
        res.json(data.data.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => ({
            name: artist.name,
            url: artist.external_urls.spotify,
          })),
          image: track.album.images[0],
          explicit: track.explicit,
          album: track.album.name,
          albumUrl: track.album.external_urls.spotify,
          url: track.external_urls.spotify,
          popularity: track.popularity
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
        seedTracks = `${seedTracks},${filteredSongs[j].songId}`;
      }

      seedTracks = seedTracks.slice(1);

      requests.push(
        axios.get(`${spotifyUrl}/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            seed_tracks: seedTracks,
            limit: 5,
          },
        }),
      );

      seedTracks = '';
    }

    axios.all(requests)
      .then(axios.spread((...responses) => {
        const result = [];
        for (const response of responses) {
          response.data.tracks.map((track) => {
            console.log(track);
            const filteredTrack = {
              id: track.id,
              name: track.name,
              artists: track.artists.map((artist) => ({
                name: artist.name,
                url: artist.external_urls.spotify,
              })),
              image: track.album.images[0],
              explicit: track.explicit,
              album: track.album.name,
              albumUrl: track.album.external_urls.spotify,
              url: track.external_urls.spotify,
              popularity: track.popularity
            };
            if (!result.includes(filteredTrack)) result.push(filteredTrack);
          });
        }

        res.json(result);
      }))
      .catch((err) => {
        res.json(err);
      });
  }
});

module.exports = router;
