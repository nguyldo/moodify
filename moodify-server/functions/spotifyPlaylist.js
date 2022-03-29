const axios = require('axios');
const imageToBase64 = require('image-to-base64');

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
    console.log(toReturn);
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
};
