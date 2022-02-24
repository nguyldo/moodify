const express = require('express');
const axios = require('axios');

const Angry = require("../models/angry")
const Bad = require("../models/bad")
const Content = require("../models/content")
const Excited = require("../models/excited")
const Happy = require("../models/happy")
const Sad = require("../models/sad")
const Song = require("../models/song")

const router = express.Router();

const spotify_url = 'https://api.spotify.com/v1';

router.post('/recommendations', async (req, res) => {
    const { mood, associatedFeel, token } = req.body;

    let allSongs = [];
    switch (mood) {
        case 'angry':
            allSongs = await Angry.find();
            break;
        case 'bad':
            allSongs = await Bad.find();
            break;
        case 'content':
            allSongs = await Content.find();
            break;
        case 'excited':
            allSongs = await Excited.find();
            break;
        case 'happy':
            allSongs = await Happy.find();
            break;
        case 'sad':
            allSongs = await Sad.find();
            break;
    }


    let filteredSongs = [];
    if (associatedFeel !== "") {
        const filteredSongs = allSongs.filter(song => song.associatedFeels === associatedFeel);
    } else {
        filteredSongs = allSongs;
    }

    console.log(filteredSongs)
    let seed_tracks = "";

    if (filteredSongs.length <= 5) {
        filteredSongs.map((song) => {
            seed_tracks = seed_tracks + "," + song.songID
        })

        seed_tracks = seed_tracks.slice(1);

        const params = {
            seed_tracks: seed_tracks,
            limit: 30
        }

        axios.get(spotify_url + '/recommendations', {
            headers: { Authorization: `Bearer ${token}` },
            params: params
        })
            .then((data) => {
                console.log(data.data.tracks);
                res.json(data.data.tracks.map((track) => ({ id: track.id, name: track.name, artists: track.artists.map(artist => artist.name) })));
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
    } else {
        let requests = [];
        for (let i = 0; i < 6; i++) {
            let randomIndices = [];
            while (randomIndices.length < 5) {
                const randomNumber = Math.floor(Math.random() * filteredSongs.length);
                if (!randomIndices.includes(randomIndices)) randomIndices.push(randomNumber);
            }

            let seed_tracks = "";

            for (const i of randomIndices) {
                seed_tracks = seed_tracks + "," + filteredSongs[i].songID;
            }

            seed_tracks = seed_tracks.slice(1);

            requests.push(
                axios.get(spotify_url + '/recommendations', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        seed_tracks: seed_tracks,
                        limit: 5
                    }
                })
            )
        }

        axios.all(requests)
            .then(axios.spread((...responses) => {
                let result = []
                for (const response of responses) {
                    response.data.tracks.map((track) => {
                        const filteredTrack = { 
                            id: track.id, 
                            name: track.name, 
                            artists: track.artists.map(artist => artist.name) 
                        }
                        if (!result.includes(filteredTrack)) result.push(filteredTrack);
                    })
                }

                res.json(result);
            }))
    }
})

module.exports = router;