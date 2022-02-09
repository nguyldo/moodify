const express = require("express");

const songRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/song").get(function (req, res) {
    let db_connect = dbo.getDb();
    db_connect
      .collection("Song")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        console.log(result);
      });
  });

  module.exports = songRoutes;