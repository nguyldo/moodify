const express = require('express');

const app = express();
const port = 5000;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const userRoutes = require('./routes/user');

app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello Moodify World');
});

app.listen(port, () => {
  console.log(`\nMoodify server listening on port ${port}`);
});

//
const mongoose = require("mongoose");
const Router = require("./routes")

app.use(express.json());

//app.use(Router);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});

mongoose.connect(`mongodb+srv://moodify:teletubbies@cluster1.wlzag.mongodb.net/Moodify?retryWrites=true&w=majority`);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});