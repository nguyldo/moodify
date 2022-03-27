const axios = require('axios');

const spotifyUrl = 'https://api.spotify.com/v1';

async function checkPlaylistFollow(playlist, id, token) {
  return axios.get(`${spotifyUrl}/playlists/${playlist}/followers/contains?ids=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    const toReturn = data.data;
    console.log(toReturn);
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
  return axios.post(`${spotifyUrl}/users/${userId}/playlists`, {
    headers: { Authorization: `Bearer ${token}` },
    body: {
      name,
      description: 'A Moodify Playlist',
    },
  }).then((data) => {
    const toReturn = data.data;
    console.log(toReturn);
    return toReturn;
  }).catch((err) => {
    console.log(err);
  });
}

async function addSongsToPlaylist(playlist, token, uris) {
  return axios.post(`${spotifyUrl}/playlists/${playlist}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
    body: {
      uris,
    },
  }).then((data) => {
    const toReturn = data.data;
    console.log(toReturn);
    return toReturn;
  }).catch((err) => {
    console.log(err);
  });
}

async function addPhotoToPlaylist(playlist, token, imgFile) {
  return axios.post(`${spotifyUrl}/playlists/${playlist}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
    body: imgFile,
  }).then((data) => {
    const toReturn = data.data;
    console.log(toReturn);
    return toReturn;
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = {
  checkPlaylistFollow,
  followPlaylist,
  unFollowPlaylist,
  createPlaylist,
  addSongsToPlaylist,
  addPhotoToPlaylist,
};
