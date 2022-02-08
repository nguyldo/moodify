const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/:token', (req, res) => {
  const { token } = req.params;

  axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((data) => {
      res.json(data.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
