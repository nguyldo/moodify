const express = require('express');
const axios = require('axios');

const router = express.Router();
const {
  audioFeatures, idsToTracks, spotifyRecommend, filterTracks, saveSong,
} = require('../functions/spotifySong');
const { userTop, getUserId } = require('../functions/spotifyUser');
const { getSongByMood } = require('../functions/mongoSong');
const {
  followPlaylist,
  unFollowPlaylist,
  generateTitle,
  createPlaylist,
  addSongsToPlaylist,
  generateImage,
  addPhotoToPlaylist,
  grabImage,
} = require('../functions/spotifyPlaylist');

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
              console.log(track.artists);
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

// http://localhost:5000/playlist/create?token={token}&name={playlistName}&ids={csv of songs to create playlist w/}
// returns generated playlist href
router.post('/create', async (req, res) => {
  const { token, ids, name } = req.query;
  try {
    console.log(`Token: ${token}`);
    const username = await getUserId(token);
    console.log(`User: ${username}`);
    console.log(`Name: ${name}`);
    const generatedPlaylist = await createPlaylist(name, username, token);
    // console.log(`Playlist: ${generatedPlaylist}`);
    const arr = ids.split(',');
    console.log(`Arr: ${arr}`);
    const uris = (await idsToTracks(arr, token)).map((track) => track.songURI);
    console.log(`URIs: ${uris}`);
    const value = await addSongsToPlaylist(generatedPlaylist.id, token, uris);
    console.log(`Value: ${value}`);
    const img = await grabImage(name);
    await addPhotoToPlaylist(generatedPlaylist.id, token, img);
    if (value) res.status(200).send(generatedPlaylist.external_urls.spotify);
    else res.status(401).send('Failed');
  } catch (error) {
    console.log('Failed');
    res.status(401).send('Failed');
  }
});

// http://localhost:5000/playlist/generatetitle?coremood={core mood}
router.post('/generatetitle', async (req, res) => {
  const { coremood } = req.query;
  try {
    const playlistName = await generateTitle();
    res.status(200).send(`${coremood} ${playlistName}`);
  } catch (error) {
    res.status(401).send(error);
  }
});

// http://localhost:5000/playlist/generateimg?text={text}
router.post('/generateimg', async (req, res) => {
  const { text } = req.query;
  try {
    const imgLink = await generateImage(text);
    res.status(200).send(imgLink);
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

router.put('/save', async (req, res) => {
  const { ids, token } = req.query;
  try {
    const text = await saveSong(ids, token);
    console.log(text.data);
    res.status(200).send(text.data);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
