const express = require('express');
const axios = require('axios');

const router = express.Router();
const {
  audioFeatures, idsToTracks, spotifyRecommend, filterTracks,
} = require('../functions/spotifySong');
const { userTop } = require('../functions/spotifyUser');
const { getSongByMood } = require('../functions/mongoSong');
const { followPlaylist, unFollowPlaylist } = require('../functions/spotifyPlaylist');

const spotifyUrl = 'https://api.spotify.com/v1';

// http://localhost:5000/recommendations
router.post('/recommendations', async (req, res) => {
  const { mood, associatedFeels, token } = req.body;

  // Update the thing using just Song.find()
  try {
    let allSongs = [];
    allSongs = await getSongByMood(mood);

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
          if (filteredSongs[j].songID !== undefined) {
            seedTracks = `${seedTracks},${filteredSongs[j].songID}`;
          } else if (filteredSongs[j].songId) {
            seedTracks = `${seedTracks},${filteredSongs[j].songId}`;
          }
        }

        console.log(seedTracks);

        seedTracks = seedTracks.slice(1);

        if (seedTracks) {
          requests.push(
            axios.get(`${spotifyUrl}/recommendations`, {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                seed_tracks: seedTracks,
                limit: 5,
              },
            }),
          );
        }

        seedTracks = '';
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
                image: track.album.images[0],
                explicit: track.explicit,
              };
              if (!result.includes(filteredTrack)) result.push(filteredTrack);
            });
          }
          console.log(result.length);
          res.json(result);
        }))
        .catch((err) => {
          res.json(err);
        });
    }
  } catch (error) {
    res.send(400).send(error);
  }
});

// http://localhost:5000/playlist/personal/{token}?cm={coremood}&am1={associatedmood}&am2={associatedmood}
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

// http://localhost:5000/playlist/follow?token={token}&id={playlistId}&follow={true || false}
router.get('/follow', async (req, res) => {
  const { token, id, follow } = req.params;

  try {
    let result;
    if (follow) {
      result = followPlaylist(token, id);
    } else {
      result = unFollowPlaylist(token, id);
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

// http://localhost:5000/playlist/follow?token={token}&id={playlistId}&follow={true || false}
router.get('/follow', async (req, res) => {
  const { token, id, follow } = req.params;

  try {
    let result;
    if (follow) {
      result = followPlaylist(token, id);
    } else {
      result = unFollowPlaylist(token, id);
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

// http://localhost:5000/playlist/follow?token={token}&id={playlistId}&follow={true || false}
router.get('/create', async (req, res) => {
  const { token, id, follow } = req.params;

  try {
    let result;
    if (follow) {
      result = followPlaylist(token, id);
    } else {
      result = unFollowPlaylist(token, id);
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

// http://localhost:5000/playlist/generateimage/{text}
router.get('/generateimage/:text', async (req, res) => {
  const { text } = req.params;

  try {
    const img = await axios.get(`https://picsum.photos/seed/${text}/500`);
    const imgId = img.headers['picsum-id'];
    const uri = await axios.get(`https://picsum.photos/id/${imgId}/info`);
    res.status(200).send(uri.data.url);
  } catch (error) {
    res.status(400).send(error);
  }
});

// http://localhost:5000/playlist/generatetitle/
router.get('/generatetitle', async (req, res) => {
  try {
    const text = await axios.get('https://randomuser.me/api/');
    res.status(200).send(`${text.data.results[0].name.last} ${text.data.results[0].location.street.name}`);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
