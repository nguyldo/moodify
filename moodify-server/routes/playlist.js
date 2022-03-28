const express = require('express');
const axios = require('axios');

// const Angry = require('../models/angry');
// const Bad = require('../models/bad');
// const Content = require('../models/content');
// const Excited = require('../models/excited');
// const Happy = require('../models/happy');
// const Sad = require('../models/sad');

const router = express.Router();

// Function Imports
// const { getUserId } = require('../functions/spotifyUser');
const { prettifySong } = require('../functions/spotifySong');

const spotifyUrl = 'https://api.spotify.com/v1';

// router.post('/recommendations', async (req, res) => {
//   const { mood, associatedFeels, token } = req.body;

//   let allSongs = [];
//   switch (mood) {
//     case 'angry':
//       allSongs = await Angry.find();
//       break;
//     case 'bad':
//       allSongs = await Bad.find();
//       break;
//     case 'content':
//       allSongs = await Content.find();
//       break;
//     case 'excited':
//       allSongs = await Excited.find();
//       break;
//     case 'happy':
//       allSongs = await Happy.find();
//       break;
//     case 'sad':
//       allSongs = await Sad.find();
//       break;
//     default:
//       break;
//   }

//   let filteredSongs = [];
//   if (associatedFeels.length > 0) {
//     allSongs.map((song) => {
//       for (const moodTag of song.associatedFeels) {
//         if (associatedFeels.includes(moodTag)) {
//           filteredSongs.push(song);
//           break;
//         }
//       }
//     });
//   } else {
//     filteredSongs = allSongs;
//   }

//   console.log(filteredSongs);
//   let seedTracks = '';

//   if (filteredSongs.length <= 5) {
//     filteredSongs.map((song) => {
//       seedTracks = `${seedTracks},${song.songID}`;
//     });

//     seedTracks = seedTracks.slice(1);

//     const params = {
//       seed_tracks: seedTracks,
//       limit: 30,
//     };

//     axios.get(`${spotifyUrl}/recommendations`, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     })
//       .then((data) => {
//         console.log('2');
//         console.log(data.data.tracks);
//         console.log('2');
//         res.json(data.data.tracks.map((track) => ({
//           id: track.id,
//           name: track.name,
//           artists: track.artists.map((artist) => artist.name),
//         })));
//       })
//       .catch((err) => {
//         console.log(err);
//         res.json(err);
//       });
//   } else {
//     const requests = [];
//     for (let i = 0; i < 6; i += 1) {
//       const randomIndices = [];
//       while (randomIndices.length < 5) {
//         const randomNumber = Math.floor(Math.random() * filteredSongs.length);
//         if (!randomIndices.includes(randomIndices)) randomIndices.push(randomNumber);
//       }

//       for (const j of randomIndices) {
//         seedTracks = `${seedTracks},${filteredSongs[j].songID}`;
//       }

//       seedTracks = seedTracks.slice(1);

//       requests.push(
//         axios.get(`${spotifyUrl}/recommendations`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: {
//             seed_tracks: seedTracks,
//             limit: 5,
//           },
//         }),
//       );

//       seedTracks = '';
//     }

//     axios.all(requests)
//       .then(axios.spread((...responses) => {
//         const result = [];
//         for (const response of responses) {
//           response.data.tracks.map((track) => {
//             console.log(track);
//             const filteredTrack = {
//               id: track.id,
//               name: track.name,
//               artists: track.artists.map((artist) => artist.name),
//               image: track.album.images[0],
//               explicit: track.explicit,
//             };
//             if (!result.includes(filteredTrack)) result.push(filteredTrack);
//           });
//         }

//         res.json(result);
//       }))
//       .catch((err) => {
//         res.json(err);
//       });
//   }
// });

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

// gets user's playlists
// returns user's playlists - this route was used for testing purposes
// https://localhost:5000/playlist/all?token={token}
router.get('/all', async (req, res) => {
  const { token } = req.query;

  return axios.get(`${spotifyUrl}/me/playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((data) => {
    // console.log(data.data.items);
    res.status(200).send(data.data.items);
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

module.exports = router;
