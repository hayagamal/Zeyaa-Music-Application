const User = require("../models/users");
const Audio = require("../models/audios");
var ObjectId = require("mongodb").ObjectId;

// function  to return user's document
function getUser(id, callBack) {
  User.findOne(
    {
      _id: ObjectId(id),
    },
    function (error, user) {
      callBack(user);
    }
  );
}

exports.postSubscribe = function (request, result) {
  console.log(Object.keys(request.body)[0]);

  if (request.session.user_id) {
    Audio.findOne(
      {
        _id: ObjectId(Object.keys(request.body)[0]),
      },
      function (error1, audio) {
        if (request.session.user_id == audio.user._id) {
          result.json({
            status: "error",
            message: "You cannot subscribe on your own channel",
          });
        } else {
          //check if channel is already subscribed
          getUser(request.session.user_id, function (myData) {
            var flag = false;
            for (var a = 0; a < myData.subscriptions.length; a++) {
              if (
                myData.subscriptions[a]._id.toString() == audio.user.toString
              ) {
                flag = true;
                break;
              }
            }
            if (flag) {
              result.json({
                status: "error",
                message: "Already subscribed",
              });
            } else {
              User.findOneAndUpdate(
                {
                  _id: audio.user._id,
                },
                {
                  $inc: {
                    subscribers: 1,
                  },
                },
                {
                  returnOriginal: false,
                },
                function (error2, userData) {
                  User.updateOne(
                    {
                      _id: ObjectId(request.session.user_id),
                    },
                    {
                      $push: {
                        subscriptions: {
                          _id: audio.user._id,
                          name: audio.user.name,
                          subscribers: userData.subscribers,
                          image: userData.image,
                        },
                      },
                    },
                    function (error3, data) {
                      Audio.findOneAndUpdate(
                        {
                          _id: ObjectId(request.body.audioId),
                        },
                        {
                          $inc: {
                            "user.subscribers": 1,
                          },
                        }
                      );
                      result.json({
                        status: "success",
                        message: "subscription has been adedd",
                      });
                    }
                  );
                }
              );
            }
          });
        }
      }
    );
  } else {
    result.json({
      status: "error",
      message: "Please login to perform this action.",
    });
  }
};
