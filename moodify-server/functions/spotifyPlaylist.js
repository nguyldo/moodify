const axios = require('axios');
const imageToBase64 = require('image-to-base64');

const { prettifySong } = require('./spotifySong');

const spotifyUrl = 'https://api.spotify.com/v1';

async function checkPlaylistFollow(playlist, id, token) {
  return axios.get(`${spotifyUrl}/playlists/${playlist}/followers/contains?ids=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    const toReturn = data.data;
    // console.log(toReturn);
    return toReturn;
  }).catch((err) => {
    console.log('unsuccessful user playlist follow');
    console.log(err);
  });
}

async function followPlaylist(playlist, token) {
  return axios.put(`${spotifyUrl}/playlists/${playlist}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    const toReturn = data.data;
    return toReturn;
  }).catch((err) => {
    console.log(err);
  });
}

async function unFollowPlaylist(playlist, token) {
  return axios.delete(`${spotifyUrl}/playlists/${playlist}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    const toReturn = data.data;
    return toReturn;
  }).catch((err) => {
    console.log(err);
  });
}

async function createPlaylist(name, userId, token) {
  return axios.post(
    `${spotifyUrl}/users/${userId}/playlists`,
    {
      name,
      description: 'A Moodify Playlist',
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  ).then((data) => {
    const toReturn = data.data;
    // console.log(toReturn);
    return toReturn;
  }).catch((err) => {
    console.log(err);
  });
}

// Playlist is Playlist ID
// Token is User Token
// URIs are an array of uris
async function addSongsToPlaylist(playlist, token, uris) {
  return axios.post(
    `${spotifyUrl}/playlists/${playlist}/tracks`,
    {
      uris,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  ).then((data) => {
    const toReturn = data.data;
    // console.log(toReturn);
    return toReturn;
  }).catch((err) => {
    console.log(err.data.error);
  });
}

async function addPhotoToPlaylist(playlist, token, imgFile) {
  return axios.put(
    `${spotifyUrl}/playlists/${playlist}/images`,
    imgFile,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'image/jpeg',
      },
    },
  ).then((data) => {
    const toReturn = data.data;
    // console.log(toReturn);
    return toReturn;
  }).catch((err) => {
    console.log(err.response.data);
    console.log('Failed to Add Photo');
  });
}

async function generateTitle() {
  const text = await axios.get('https://randomuser.me/api/');
  return `${text.data.results[0].name.last} ${text.data.results[0].location.street.name}`;
}

async function generateImage(text) {
  const img = await axios.get(`https://picsum.photos/seed/${text}/500`);
  const imgId = img.headers['picsum-id'];
  const uri = await axios.get(`https://picsum.photos/id/${imgId}/info`);
  return uri.data.download_url;
}

async function grabImage(text) {
  // const thing = await axios.get(`https://picsum.photos/seed/${text}/50`);
  // const imgId = thing.headers['picsum-id'];
  // const src = (await axios.get(`https://picsum.photos/id/${imgId}/info`)).data.download_url;
  const base64 = await imageToBase64(`https://picsum.photos/seed/${text}/200`).then((data) => data).catch(() => {
    console.log('Grab Image Fail');
  });
  return base64;
}

function filterTrackData(track) {
  return {
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
    uri: track.uri,
    popularity: track.popularity,
  };
}

async function checkSavedTracks(tracks, token) {
  tracks.forEach(async (element) => {
    await axios.get(`${spotifyUrl}/me/tracks/contains?ids=${element.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => {
      // console.log(data.data);
      element.existsInSavedTracks = data.data[0];
    });
  });
  console.log(tracks);
  return tracks;
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
    return checkSavedTracks(filteredTracks, token);
  }

  // IF THERE ARE 5+ SONG RECS
  const requests = [];
  for (let i = 0; i < 5; i += 1) {
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
  const existingSongIds = [];
  for (const response of responses) {
    response.data.tracks.map((track) => {
      console.log(track);
      const filteredTrack = filterTrackData(track);
      if (!existingSongIds.includes(filteredTrack.id)) {
        result.push(filteredTrack);
        existingSongIds.push(filteredTrack.id);
      }
    });
  }

  return checkSavedTracks(result, token);
}

async function getLikedSongs(token) {
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

      return prettifySong(arr);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

module.exports = {
  checkPlaylistFollow,
  followPlaylist,
  unFollowPlaylist,
  createPlaylist,
  addSongsToPlaylist,
  addPhotoToPlaylist,
  generateTitle,
  generateImage,
  grabImage,
  getRecommendations,
  filterTrackData,
  getLikedSongs,
};
