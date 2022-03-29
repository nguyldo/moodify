/* eslint-disable guard-for-in */
const axios = require('axios');

const spotifyUrl = 'https://api.spotify.com/v1';

async function getArtistGenres(ids, token) {
  const data = await axios.get(`${spotifyUrl}/artists`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { ids },
  });

  const filteredArtists = data.data.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
    url: artist.external_urls.spotify,
    genres: artist.genres,
  }));

  const ret = {};

  for (const artist of filteredArtists) {
    ret[artist.id] = artist;
  }

  return ret;
}

module.exports = { getArtistGenres };
