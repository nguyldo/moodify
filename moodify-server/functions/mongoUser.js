const User = require('../models/user');

async function findUser(userId) {
    try {
      let promise_obj = await User.findOne(
        { "userId": userId }
      )
      console.log(promise_obj);
      return {
        "userId": promise_obj.userId,
        "logins": promise_obj.logins,
        "recommendedSongIds": promise_obj.recommendedSongIds,
        "numRecommendations": promise_obj.numRecommendations
      };
    } catch (err) {
      console.log(err);
    }
}

async function saveUser(data) {
    try {
        let toReturn = await User.findOneAndUpdate(
            { "userId": data.userId },
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
          "userId": user.userId,
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
        { "userId": user.userId }
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
            { "userId": id },
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