const axios = require('axios');

const spotifyUrl = 'https://api.spotify.com/v1';

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
// Returns json list of songs w/ info
async function idsToTracks(combinedTracks, token) {
  console.log('running get tracks');

  const str = combinedTracks.join();

<<<<<<< HEAD
  return axios.get(`${spotifyUrl}/tracks?ids=${str}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    console.log('Got tracks!');
    const items = data.data.tracks;
    const toReturn = [];
    items.forEach((element) => {
      toReturn.push({
        songID: element.id,
        songName: element.name,
        songArtist: element.artists,
        songAlbum: element.album.name,
        moodTag: '',
=======
    return await axios.get(spotify_url + '/tracks?ids=' + str, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((data) => {
      console.log('Got tracks!');
      var items = data.data.tracks;
      var toReturn = [];
      items.forEach(element => {
        toReturn.push({
          "songId": element.id,
          "songName": element.name,
          "songArtist": element.artists,
          "songAlbum": element.album.name,
          "moodTag": "",
        });
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
      });
    });
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
  // console.log(list)
  list = features.audio_features.filter((item) => {
    if (item) return list.includes(item.id);
  });
  // console.log(list)

  // console.log(toFilter)
  toFilter = features.audio_features.filter((item) => {
    if (item) return toFilter.includes(item.id);
  });

  values = list.reduce((prev, curr) => ({
    tempo: (curr.tempo + prev.tempo) / 2,
    energy: (curr.energy + prev.energy) / 2,
    loudness: (curr.loudness + prev.loudness) / 2,
    danceability: (curr.danceability + prev.danceability) / 2,
    valence: (curr.valence + prev.valence) / 2,
    liveness: (curr.liveness + prev.liveness) / 2,
  }));

  toFilter = toFilter.filter((item) => {
    dance = Math.abs(item.danceability - values.danceability) < 0.1;
    energy = Math.abs(item.energy - values.energy) < 0.5;
    loud = Math.abs(item.loudness - values.loudness) < 10;
    live = Math.abs(item.liveness - values.liveness) < 0.2;
    val = Math.abs(item.valence - values.valence) < 0.2;
    tempo = Math.abs(item.tempo - values.tempo) < 10;
    // console.log(item.id, tempo, energy, loud, dance, val, live);
    return tempo && energy && loud && dance && val && live;
  });

  if (toFilter.length == 0) {
    toFilter.push(list[0]);
  }

  return toFilter.map((item) => item.id);
}

<<<<<<< HEAD
module.export = {
  spotifyRecommend, idsToTracks, audioFeatures, filterTracks,
};
=======
async function searchSong(term, type, token) {
  return await axios.get(spotify_url + '/search?q=' + term + '&type=' + type, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
      console.log('successful search')
      var items = data.data.tracks.items;
      var toReturn = [];
      items.forEach(element => {
        let rawArtists = element.artists;
        let artists = [];
        let artistUrl = []
        rawArtists.forEach(artist => {
          artists.push(artist.name)
          artistUrl.push(artist.external_urls.spotify)
        });

        toReturn.push({
          "songId": element.id,
          "songName": element.name,
          "songArtist": artists,
          "artistUrl": artistUrl,
          "songAlbum": element.album.name,
          "albumUrl": element.album.external_urls.spotify,
          "imageUrl": element.album.images[0].url,
          "explicit": element.explicit,
          "popularity": element.popularity
        });
      });
      return toReturn;
    })
    .catch((error) => {
      console.log('unsuccessful search')
      console.log(error.data);
    });
}

module.exports = { spotifyRecommend, idsToTracks, audioFeatures, filterTracks, searchSong };
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
