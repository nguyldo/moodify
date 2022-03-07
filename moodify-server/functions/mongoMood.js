const Mood = require('../models/mood');

// checks if mood is already in db and updates, if not it'll create it.
async function checkMood(mood, userID) {
    try {
        let promise_obj = await Mood.findOne(
            { "userID": userID, "type": mood }
        );
      if (promise_obj) {
        let arr = promise_obj.timeStamp;
        let timeNow = new Date();
        arr.push(timeNow.getTime());
        await Mood.updateOne(
          {
            "userID": userID,
            "type": mood
          },
          {
            "timeStamp": arr,
            "totalCount": promise_obj.totalCount + 1
          }
        )
      } else {
        let timeNow = new Date();
        let userMood = new Mood(
          {
            "userID": userID,
            "type": mood,
            "timeStamp": [timeNow.getTime()],
            "totalCount": 1,
          }
        )
        await userMood.save()
      }
    } catch (err) {
      console.log(err)
    }
}

module.exports = { checkMood };