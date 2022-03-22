const User = require('../models/user');

<<<<<<< HEAD
async function findUser(userID) {
  try {
    const promiseObj = await User.findOne(
      { userID },
    );
    console.log(promiseObj);
    return {
      userID: promiseObj.userID,
      logins: promiseObj.logins,
      recommendedSongIDs: promiseObj.recommendedSongIDs,
      numRecommendations: promiseObj.numRecommendations,
    };
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function saveUser(data) {
  try {
    const toReturn = await User.findOneAndUpdate(
      { userID: data.userID },
      data,
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
        userID: user.userID,
        logins: 1,
        numRecommendations: 0,
        loggedin: true,
      },
    ).save();
  } catch (err) {
    console.log(err);
  }
}

async function checkUser(user) {
  try {
    return await User.findOne(
      { userID: user.userID },
    ).then((data) => {
      if (data) {
        // console.log(data)
        data.logins += 1;
        data.loggedin = true;
        data.save();
        return false;
      }
      return true;
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function logout(id) {
  try {
    return User.findOneAndUpdate(
      { userID: id },
      { loggedin: false },
    ).then((data) => {
      if (data) {
        return 'Successfully Logged Out';
      }
      return 'Failed to Log Out';
    });
  } catch (error) {
    console.log(error);
    return (error);
  }
=======
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
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
}

module.exports = {
  findUser, postUser, checkUser, logout, saveUser,
};
