const Mood = require('../models/mood');

// checks if mood is already in db and updates, if not it'll create it.
async function checkMood(mood, userID) {
  try {
    const promiseObj = await Mood.findOne(
      { userID, type: mood },
    );
    if (promiseObj) {
      const arr = promiseObj.timeStamp;
      const timeNow = new Date();
      arr.push(timeNow.getTime());
      await Mood.updateOne(
        {
          userID,
          type: mood,
        },
        {
          timeStamp: arr,
          totalCount: promiseObj.totalCount + 1,
        },
      );
    } else {
      const timeNow = new Date();
      const userMood = new Mood(
        {
          userID,
          type: mood,
          timeStamp: [timeNow.getTime()],
          totalCount: 1,
        },
      );
      await userMood.save();
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { checkMood };
