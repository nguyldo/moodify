const axios = require('axios');

const spotifyUrl = 'https://api.spotify.com/v1';

async function getArtistGenres(ids, token) {
  return axios.get(`${spotifyUrl}/artists`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { ids },
  }).then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = { getArtistGenres };
