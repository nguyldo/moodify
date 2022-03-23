const User = require('../models/user');

async function findUser(userId) {
  try {
    const promiseObj = await User.findOne(
      { userId },
    );
    console.log(promiseObj);
    return {
      userId: promiseObj.userId,
      logins: promiseObj.logins,
      recommendedSongIds: promiseObj.recommendedSongIds,
      numRecommendations: promiseObj.numRecommendations,
    };
  } catch (err) {
    console.log(err);
  }
}

async function saveUser(data) {
  try {
    const toReturn = await User.findOneAndUpdate(
      { userId: data.userId },
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
        userId: user.userId,
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
      { userId: user.userId },
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
  }
}

async function logout(id) {
  try {
    return User.findOneAndUpdate(
      { userId: id },
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
}

module.exports = {
  findUser, postUser, checkUser, logout, saveUser,
};
