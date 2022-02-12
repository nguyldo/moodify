const express = require("express");
const model = require("../models/")
const router = express.Router();

// Get 
router.get("/getpath", async (req, res) => {
    console.log("It Works!");
})

// Post
router.post("/postpath", async (req, res) => {
    console.log("It Works!")
})

module.exports = router;