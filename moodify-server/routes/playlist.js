const express = require('express');
const axios = require('axios');

// const Angry = require('../models/angry');
// const Bad = require('../models/bad');
// const Content = require('../models/content');
// const Excited = require('../models/excited');
// const Happy = require('../models/happy');
// const Sad = require('../models/sad');

const router = express.Router();

// const { getUserId } = require('../functions/spotifyUser');

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
router.get('/liked', (req, res) => {
  const { token } = req.query;
  return axios.get(`${spotifyUrl}/me/tracks?offset=90&limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((data) => {
      const songs = data.data.items;
      const toReturn = [];
      const arr = [];
      for (let i = 0; i < songs.length; i += 1) {
        console.log(songs[i].track.name);
        arr.push(songs[i].track);
      } // end for

      arr.forEach((element) => {
        const rawArtists = element.artists;
        const artists = [];
        const artistUrl = [];
        rawArtists.forEach((artist) => {
          artists.push(artist.name);
          artistUrl.push(artist.external_urls.spotify);
        });

        toReturn.push({
          songId: element.id,
          songName: element.name,
          songArtist: artists,
          artistUrl,
          songAlbum: element.album.name,
          albumUrl: element.album.external_urls.spotify,
          imageUrl: element.album.images[0].url,
          explicit: element.explicit,
          popularity: element.popularity,
        });
      });
      console.log(songs.length);
      res.json(toReturn);
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
  const arr = ids.split(',');
  console.log('adding to saved tracks');
  console.log(ids);
  console.log(token);
  console.log('tracks:');
  console.log(arr);

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

// saves a song or multiple songs to user's Liked Songs playlist
// returns 200 if successful, prints out error if unsuccessful
// https://localhost:5000/playlist/delete?ids={track1,track2,etc}&token={token}
router.delete('/delete', async (req, res) => {
  const { ids, token } = req.query;
  const arr = ids.split(',');
  console.log('deleting saved tracks');
  console.log(ids);
  console.log(token);
  console.log('tracks:');
  console.log(arr);

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

module.exports = router;
