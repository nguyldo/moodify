const express = require("express");
const songRoutes = express.Router();

const Song = require("../models/song");

//const dbo = require("../db/conn");
//const ObjectId = require("mongodb").ObjectId;

// songRoutes.route("/song").get(function (req, res) {
//     let db_connect = dbo.getDb("Song");
//     db_connect
//       .collection("Song")
//       .find({})
//       .toArray(function (err, result) {
//         if (err) throw err;
//         res.json(result);
//         console.log(result);
//       });
//   });

songRoutes.get("/song", async (req, res) => {
  console.log("hello");
  const songs = await Song.find();
  res.send(songs);
})

module.exports = songRoutes;