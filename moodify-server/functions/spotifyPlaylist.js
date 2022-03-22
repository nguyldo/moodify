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

module.exports = { checkPlaylistFollow };
