const axios = require('axios');

const spotifyUrl = 'https://api.spotify.com/v1';

const { filterTrackData } = require('./spotifyPlaylist');
const { getArtistGenres } = require('./spotifyArtist');

// Request to spotify for new songs
// Returns json list of songs
async function spotifyRecommend(combinedTracks, token) {
  console.log('running spotify recommend');

  const str = combinedTracks.join();

  return axios.get(`${spotifyUrl}/recommendations?seed_tracks=${str}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got recommendations!');
    const items = data.data.tracks;
    const toReturn = [];
    items.forEach((element) => {
      toReturn.push(element.id);
    });
    return toReturn;
  }).catch((err) => {
    console.log('unsuccessful recommendations');
    console.log(err);
  });
}

// Request to spotify for songs info
// combinedTracks are array of song ids
// token is user's token
// Returns array of json songs w/ info
async function idsToTracks(combinedTracks, token) {
  console.log('running get tracks');

  const str = combinedTracks.join();

  return axios.get(`${spotifyUrl}/tracks?ids=${str}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (data) => {
    console.log('Got tracks!');
    const items = data.data.tracks;
    let toReturn = [];
    items.forEach((element) => {
      toReturn.push(filterTrackData(element));
    });

    const artists = [];
    toReturn.map((song) => {
      for (const artist of song.artists) {
        if (!artists.includes(artist.id)) {
          artists.push(artist.id);
        }
      }
    });

    const artistIds = artists.join(',');

    const artistsData = await getArtistGenres(artistIds, token);

    toReturn = toReturn.map((song) => {
      const newArtists = [];
      for (const artist of song.artists) {
        newArtists.push(artistsData[artist.id]);
      }
      const newSong = song;
      newSong.artists = newArtists;
      return newSong;
    });

    console.log(toReturn);

    return toReturn;
  }).catch((err) => {
    console.log('unsuccessful get tracks');
    console.log(err);
  });
}

// Request to spotify for audio features of list
// Returns list of audio features by song id
async function audioFeatures(list, token) {
  const str = list.join();
  return axios.get(`${spotifyUrl}/audio-features?ids=${str}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got audio features!');
    return data.data;
  }).catch((err) => {
    console.log('Unsuccessful audio features!');
    console.log(err);
  });
}

// Uses features to filter 'toFilter' using 'list' features
// Returns list of song ids that were filtered
async function filterTracks(toFilter, list, features) {
  const newList = features.audio_features.filter((item) => {
    if (item) return list.includes(item.id);
  });

  let newToFilter = features.audio_features.filter((item) => {
    if (item) return toFilter.includes(item.id);
  });

  const values = newList.reduce((prev, curr) => ({
    tempo: (curr.tempo + prev.tempo) / 2,
    energy: (curr.energy + prev.energy) / 2,
    loudness: (curr.loudness + prev.loudness) / 2,
    danceability: (curr.danceability + prev.danceability) / 2,
    valence: (curr.valence + prev.valence) / 2,
    liveness: (curr.liveness + prev.liveness) / 2,
  }));

  newToFilter = newToFilter.filter((item) => {
    const dance = Math.abs(item.danceability - values.danceability) < 0.1;
    const energy = Math.abs(item.energy - values.energy) < 0.5;
    const loud = Math.abs(item.loudness - values.loudness) < 10;
    const live = Math.abs(item.liveness - values.liveness) < 0.2;
    const val = Math.abs(item.valence - values.valence) < 0.2;
    const tempo = Math.abs(item.tempo - values.tempo) < 10;

    return tempo && energy && loud && dance && val && live;
  });

  if (newToFilter.length === 0) {
    newToFilter.push(newList[0]);
  }

  return newToFilter.map((item) => item.id);
}

// formats song to be readable and displays what is only needed
// returns "prettified" list of songs
function prettifySong(arr) {
  const toReturn = [];
  arr.forEach((element) => {
    const rawArtists = element.artists;
    const artists = [];
    const artistUrl = [];
    rawArtists.forEach((artist) => {
      artists.push(artist.name);
      artistUrl.push(artist.external_urls.spotify);
    });
    console.log(artists);
    console.log(artistUrl);

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
  return toReturn;
}

// searches for songs
// returns list of possible songs based on search
async function searchSong(term, type, token) {
  return axios.get(`${spotifyUrl}/search?q=${term}&type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    // console.log(data.data.tracks.items);
    const toReturn = prettifySong(data.data.tracks.items);
    console.log('successful search');
    return toReturn;
  })
    .catch((error) => {
      console.log('unsuccessful search');
      console.log(error.data);
    });
}

async function saveSong(ids, token) {
  return axios.put(`${spotifyUrl}/me/tracks?ids=${ids}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    console.log('successful save');
    const toReturn = data;
    return toReturn;
  })
    .catch((error) => {
      console.log('unsuccessful save');
      console.log(error.response.data);
    });
}

module.exports = {
  spotifyRecommend, idsToTracks, audioFeatures, filterTracks, searchSong, saveSong, prettifySong,
};
