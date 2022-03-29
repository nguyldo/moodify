const axios = require('axios');

const spotifyUrl = 'https://api.spotify.com/v1';

async function getArtistGenres(ids, token) {
  const data = await axios.get(`${spotifyUrl}/artists`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { ids },
  });

  console.log('here');
}

module.exports = { getArtistGenres };
