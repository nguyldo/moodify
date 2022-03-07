const axios = require('axios');
const spotify_url = 'https://api.spotify.com/v1';

async function checkPlaylistFollow(playlist, id, token) {
  return await axios.get(spotify_url + '/playlists/' + playlist + '/followers/contains?ids=' + id, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    let toReturn = data.data;
    console.log(toReturn);
    return toReturn;
  }).catch((err) => {
    console.log('unsuccessful user playlist follow')
    console.log(err)
  });
}

module.exports = { checkPlaylistFollow };