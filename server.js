var express = require("express");
var app = express();
var http = require("http").createServer(app);
var bodyParser = require("body-parser");
var expressSession = require("express-session");
const Audio = require("./models/audios");
const User = require("./models/users");
var dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
var ObjectId = require("mongodb").ObjectId;
const connectDB = require("./Connection");
connectDB();

app.use(
  expressSession({
    key: "user_id",
    secret: "User secret Object Id",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  bodyParser.json({
    limit: "10000mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10000mb",
    parameterLimit: 1000000,
  })
);

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

app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

http.listen(3000, function () {
  console.log("Server started.");

  app.use("/", require("./routes/index"));

  app.use("/signup", require("./routes/signUp"));

  app.use("/login", require("./routes/login"));

  app.use("/logout", require("./routes/logout"));

  app.use("/upload", require("./routes/uploadSong"));

  app.use("/watch/", require("./routes/chooseSong"));

  app.use("/do-subscribe", require("./routes/doSubscribe"));

  app.use("/get-related-audios", require("./routes/relatedAudios"));

  app.post("/do-like", function (request, result) {
    if (request.session.user_id) {
      //check if already liked
      Audio.findOne(
        {
          _id: ObjectId(request.body.audioId),
          "likers._id": request.session.user_id,
        },
        function (error, audio) {
          if (audio == null) {
            // push in likers array
            Audio.updateOne(
              {
                _id: ObjectId(request.body.audioId),
              },
              {
                $push: {
                  likers: {
                    _id: request.session.user_id,
                  },
                },
              },
              function (error, data) {
                result.json({
                  status: "success",
                  message: "Song has been liked",
                });
              }
            );
          } else {
            result.json({
              status: "error",
              message: "Already liked this song",
            });
          }
        }
      );
    } else {
      result.json({
        status: "error",
        message: "Please login",
      });
    }
  });
  app.post("/do-dislike", function (request, result) {
    if (request.session.user_id) {
      //check if already disliked
      Audio.findOne(
        {
          _id: ObjectId(request.body.audioId),
          "dislikers._id": request.session.user_id,
        },
        function (error, audio) {
          if (audio == null) {
            // push in dislikers array
            Audio.updateOne(
              {
                _id: ObjectId(request.body.audioId),
              },
              {
                $push: {
                  dislikers: {
                    _id: request.session.user_id,
                  },
                },
              },
              function (error, data) {
                result.json({
                  status: "success",
                  message: "Song has been disliked",
                });
              }
            );
          } else {
            result.json({
              status: "error",
              message: "Already disliked this song",
            });
          }
        }
      );
    } else {
      result.json({
        status: "error",
        message: "Please login",
      });
    }
  });
  app.post("/do-comment", function (request, result) {
    if (request.session.user_id) {
      getUser(request.session.user_id, function (user) {
        Audio.findOneAndUpdate(
          {
            _id: ObjectId(request.body.audioId),
          },
          {
            $push: {
              comments: {
                _id: ObjectId(),
                user: {
                  _id: user._id,
                  name: user.name,
                  image: user.image,
                },
                comment: request.body.comment,
                createdAt: new Date().getTime(),
                replies: [],
              },
            },
          },
          function (error, data) {
            //send notification to video publisher
            var channelId = data.user._id;
            User.updateOne(
              {
                _id: ObjectId(channelId),
              },
              {
                $push: {
                  notifications: {
                    _id: ObjectId(),
                    type: "new_comment",
                    content: request.body.comment,
                    is_read: false,
                    audio_watch: data.watch,
                    user: {
                      _id: user._id,
                      name: user.name,
                      image: user.image,
                    },
                  },
                },
              }
            );
            result.json({
              status: "success",
              message: "Comment has been posted",
              user: {
                _id: user._id,
                name: user.name,
                image: user.image,
              },
            });
          }
        );
      });
    } else {
      result.json({
        status: "error",
        message: "Please login",
      });
    }
  });

  app.get("/get_user", function (request, result) {
    if (request.session.user_id) {
      getUser(request.session.user_id, function (user) {
        delete user.password;
        result.json({
          status: "success",
          message: "Record has been fetched",
          user: user,
        });
      });
    } else {
      result.json({
        status: "error",
        message: "Please login to perform this action.",
      });
    }
  });

  app.post("/do-reply", function (request, result) {
    if (request.session.user_id) {
      var reply = request.body.reply;
      var commentId = request.body.commentId;
      getUser(request.session.user_id, function (user) {
        Audio.findOneAndUpdate(
          {
            "comments._id": ObjectId(commentId),
          },
          {
            $push: {
              "comments.$.replies": {
                _id: ObjectId(),
                user: {
                  _id: user._id,
                  name: user.name,
                  image: user.image,
                },
                reply: reply,
                createdAt: new Date().getTime(),
              },
            },
          },
          function (error1, data) {
            var audioWatch = data.watch;
            for (var a = 0; a < data.comments.length; a++) {
              var comment = data.comments[a];
              if (comment._id == commentId) {
                var _id = comment.user._id;
                User.updateOne(
                  {
                    _id: ObjectId(_id),
                  },
                  {
                    $push: {
                      notifications: {
                        _id: ObjectId(),
                        type: "new_reply",
                        content: reply,
                        is_read: false,
                        audio_watch: audioWatch,
                        user: {
                          _id: user._id,
                          name: user.name,
                          image: user.image,
                        },
                      },
                    },
                  }
                );
                break;
              }
            }
            result.json({
              status: "success",
              message: "Reply has been posted",
              user: {
                _id: user._id,
                name: user.name,
                image: user.image,
              },
            });
          }
        );
      });
    } else {
      result.json({
        status: "error",
        message: "Please login to perform this action.",
      });
    }
  });
});
