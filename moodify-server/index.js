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
