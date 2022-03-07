const User = require('../models/user');

async function findUser(userID) {
    try {
      let promise_obj = await User.findOne(
        { "userID": userID }
      )
      console.log(promise_obj);
      return {
        "userID": promise_obj.userID,
        "logins": promise_obj.logins,
        "recommendedSongIDs": promise_obj.recommendedSongIDs,
        "numRecommendations": promise_obj.numRecommendations
      };
    } catch (err) {
      console.log(err);
    }
}

async function saveUser(data) {
    try {
        let toReturn = await User.findOneAndUpdate(
            { "userID": data.userID },
            data
        );
        return toReturn;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function postUser(user) {
    try {
      await new User(
        {
          "userID": user.userID,
          "logins": 1,
          "numRecommendations": 0,
          "loggedin": true
        }
      ).save();
    } catch (err) {
      console.log(err);
    }
}

async function checkUser(user) {
    try {
      return await User.findOne(
        { "userID": user.userID }
      ).then((data) => {
        if (data) {
          // console.log(data)
          data.logins += 1;
          data.loggedin = true;
          data.save()
          return false;
        } else {
          return true;
        }
      })
    } catch (err) {
      console.log(err);
    }
}

async function logout(id) {
    try {
        return User.findOneAndUpdate(
            { "userID": id },
            { "loggedin": false }
        ).then((data) => {
            if (data) {
                return "Successfully Logged Out";
            } else {
                return "Failed to Log Out";
            }
        })
    } catch (error) {
        console.log(error);
        return (error);
    }
}

module.exports = { findUser, postUser, checkUser, logout, saveUser };