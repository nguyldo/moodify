const express = require('express');
const axios = require('axios');

const router = express.Router();

// Function Imports
const { prettifySong } = require('../functions/spotifySong');

const Song = require('../models/song');

// const { getArtistGenres } = require('../functions/spotifyArtist');

const spotifyUrl = 'https://api.spotify.com/v1';

// gets user's saved tracks (Liked Songs playlist)
// returns users saved tracks
// https://localhost:5000/playlist/liked?token={token}
router.get('/liked', async (req, res) => {
  const { token } = req.query;
  return axios.get(`${spotifyUrl}/me/tracks?offset=0&limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((data) => {
      const songs = data.data.items;
      const arr = [];
      for (let i = 0; i < songs.length; i += 1) {
        // console.log(songs[i].track.name);
        arr.push(songs[i].track);
      } // end for

      res.status(200).send(prettifySong(arr));
    })
    .catch((error) => {
      console.log(error.message);
    });
});

// saves a song or multiple songs to user's Liked Songs playlist
// returns 200 if successful, prints out error if unsuccessful
// https://localhost:5000/playlist/save?ids={track1,track2,etc}&token={token}
router.put('/save', async (req, res) => {
  const { ids, token } = req.query;

  return axios.put(`${spotifyUrl}/me/tracks?ids=${ids}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(() => {
    res.sendStatus(200);
  }).catch((error) => {
    console.log(error);
  });
});

// removes a song or multiple songs from user's Liked Songs playlist
// returns 200 if successful, prints out error if unsuccessful
// https://localhost:5000/playlist/delete?ids={track1,track2,etc}&token={token}
router.delete('/delete', async (req, res) => {
  const { ids, token } = req.query;

  return axios.delete(`${spotifyUrl}/me/tracks?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(() => {
    res.sendStatus(200);
  }).catch((error) => {
    console.log(error.message);
  });
});

// deletes tracks from a playlist
// returns 200 if successful, prints out error if unsuccessful
// https://localhost:5000/playlist/remove?playlistId={playlistId}&songIds={track1,track2,etc}&token={token}
router.delete('/remove', async (req, res) => {
  const { playlistId, songIds, token } = req.query;

  const tracks = [];
  const ids = songIds.split(','); // ["abc", "efg", "hij"]
  ids.forEach((element) => {
    const uri = { uri: 'spotify:track:'.concat(element) };
    tracks.push(uri);
  });

  return axios.delete(`${spotifyUrl}/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { tracks },
  }).then(() => {
    res.sendStatus(200);
  }).catch((error) => {
    console.log(error.message);
  });
});

function filterTrackData(track) {
  return {
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
    popularity: track.popularity,
  };
}

async function getRecommendations(filteredSongs, token) {
  let seedTracks = '';

  // IF THERE ARE <5 SONG RECS
  if (filteredSongs.length <= 5) {
    filteredSongs.map((song) => {
      seedTracks = `${seedTracks},${song.songId}`;
    });

    seedTracks = seedTracks.slice(1);

    const params = {
      seed_tracks: seedTracks,
      limit: 30,
    };

    const data = await axios.get(`${spotifyUrl}/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    const filteredTracks = data.data.tracks.map((track) => filterTrackData(track));
    return filteredTracks;
  }

  // IF THERE ARE 5+ SONG RECS
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

  const responses = await axios.all(requests);

  const result = [];
  for (const response of responses) {
    response.data.tracks.map((track) => {
      console.log(track);
      const filteredTrack = filterTrackData(track);
      if (!result.includes(filteredTrack)) result.push(filteredTrack);
    });
  }

  console.log('here2');
  return result;

  /*
  axios.all(requests)
    .then(axios.spread((...responses) => {
      const result = [];
      for (const response of responses) {
        response.data.tracks.map((track) => {
          console.log(track);
          const filteredTrack = filterTrackData(track);
          if (!result.includes(filteredTrack)) result.push(filteredTrack);
        });
      }

      console.log('here2');
      return result;
    }))
    .catch((err) => {
      throw err;
    });
    */
}

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

  getRecommendations(filteredSongs, token)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

/*
  let seedTracks = '';

  if (filteredSongs.length <= 5) {
    filteredSongs.map((song) => {
      seedTracks = `${seedTracks},${song.songId}`;
    });

    axios.get(`${spotifyUrl}/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
      .then((data) => {
        console.log('2');
        console.log(data.data.tracks);
        console.log('2');
        ret = data.data.tracks.map((track) => ({
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
          popularity: track.popularity,
        }));
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
                id: artist.id,
              })),
              image: track.album.images[0],
              explicit: track.explicit,
              album: track.album.name,
              albumUrl: track.album.external_urls.spotify,
              url: track.external_urls.spotify,
              popularity: track.popularity,
            };
            if (!result.includes(filteredTrack)) result.push(filteredTrack);
          });
        }

        ret = result;
      }))
      .catch((err) => {
        res.json(err);
      });
  }
*/

/*
  const artists = [];
  ret.map((song) => {
    for (const artist of song.artists) {
      if (!artists.includes(artist.id)) {
        artists.push(artist.id);
      }
    }
  });

  const artistIds = artists.join(',');
  const artistDetails = await getArtistGenres(artistIds, token);

  console.log(artistDetails);
*/

module.exports = router;
