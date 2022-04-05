// Server Imports
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Function Imports
const { getSongByMood } = require('../functions/mongoSong');
const { getArtistGenres } = require('../functions/spotifyArtist');
const {
  followPlaylist,
  unFollowPlaylist,
  generateTitle,
  createPlaylist,
  addSongsToPlaylist,
  generateImage,
  addPhotoToPlaylist,
  grabImage,
  getRecommendations,
} = require('../functions/spotifyPlaylist');
const {
  audioFeatures, idsToTracks, spotifyRecommend, filterTracks, prettifySong,
} = require('../functions/spotifySong');
const { userTop, getUserId } = require('../functions/spotifyUser');

const Song = require('../models/song');

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

// removes a song or multiple songs from user's Liked Songs playlist
// returns 200 if successful, prints out error if unsuccessful
// https://localhost:5000/playlist/delete?ids={track1,track2,etc}&token={token}
router.get('/get', async (req, res) => {
  const { ids, token } = req.query;

  return axios.get(`${spotifyUrl}/playlists/${ids}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((data) => {
    res.status(200).send(data.data);
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
    // console.log(element);
    const uri = { uri: `spotify:track:${element}` };
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
    console.log(error.response.data);
  });
});

// checks to see if a list of songs is currently in user's Liked Songs playlist
// returns an array of booleans
// https://localhost:5000/playlist/check?ids={track1,track2,etc}&token={token}
router.get('/check', async (req, res) => {
  const { ids, token } = req.query;

  return axios.get(`${spotifyUrl}/me/tracks/contains?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((data) => {
    res.status(200).send(data.data);
    // res.status(200).send(toReturn);
  }).catch((error) => {
    console.log(error);
  });
});

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
      // console.log('HELLLO');
      // console.log(data);
      const artists = [];
      data.map((song) => {
        for (const artist of song.artists) {
          if (!artists.includes(artist.id)) {
            artists.push(artist.id);
          }
        }
      });

      const artistIds = artists.join(',');
      // console.log(artistIds);

      getArtistGenres(artistIds, token)
        .then((artistsData) => {
          // console.log(artistsData);
          data = data.map((song) => {
            const newArtists = [];
            for (const artist of song.artists) {
              newArtists.push(artistsData[artist.id]);
            }
            const newSong = song;
            newSong.artists = newArtists;
            return newSong;
          });

          res.json(data);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// http://localhost:5000/playlist/personal/{token}?cm={coremood}&am1={associatedmood}&am2={associatedmood}
router.get('/personal/:token', async (req, res) => {
  const { token } = req.params;
  const { cm } = req.query;
  try {
    // Grab User's Top Tracks
    const userTracks = (await userTop(token, 'tracks')).slice(0, 50).map((item) => item.songId);
    // console.log(userTracks)

    // Grab Mongo's Mood & Associated Mood
    const mongoTracks = (await getSongByMood(cm)).slice(0, 50).map((item) => item.songId);
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

    // console.log('final log');
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
    // console.log(`Token: ${token}`);
    const username = await getUserId(token);
    // console.log(`User: ${username}`);
    // console.log(`Name: ${name}`);
    const generatedPlaylist = await createPlaylist(name, username, token);
    // console.log(`Playlist: ${generatedPlaylist}`);
    const arr = ids.split(',');
    // console.log(`Arr: ${arr}`);
    const uris = (await idsToTracks(arr, token)).map((track) => track.uri);
    // console.log(`URIs: ${uris}`);
    const value = await addSongsToPlaylist(generatedPlaylist.id, token, uris);
    // console.log(`Value: ${value}`);
    const img = await grabImage(name);
    await addPhotoToPlaylist(generatedPlaylist.id, token, img);
    if (value) res.status(200).send(generatedPlaylist.external_urls.spotify);
    else res.status(401).send('Failed');
  } catch (error) {
    console.log('Failed');
    console.log(error);
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

/*
router.put('/save', async (req, res) => {
  const { ids, token } = req.query;
  try {
    const text = await saveSong(ids, token);
    console.log(text.data);
    res.status(200).send(text.data);
  } catch (error) {
    res.status(400).send(error);
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
});
*/

module.exports = router;
