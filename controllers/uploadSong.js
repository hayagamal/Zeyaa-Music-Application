const User = require("../models/users");
const Audio = require("../models/audios");
var formidable = require("formidable");
var fileSystem = require("fs");
var expressSession = require("express-session");
var express = require("express");
var app = express();
var ObjectId = require("mongodb").ObjectId;


app.use(expressSession({
  "key": "user_id",
  "secret": "User secret Object Id",
  "resave": true,
  "saveUninitialized": true
}));

var { getAudioDurationInSeconds } = require("get-audio-duration");

// function  to return user's document
function getUser(id, callBack) {
  User.findOne({
    "_id": ObjectId(id)
  }, function (error, user) {
    callBack(user);
  });
}

exports.getUploads = function (request, result) {
  if (request.session.user_id) {
    //create new page for upload
    result.render("upload", {
      "isLogin": true
    });
  } else {
    result.redirect("/login");
  }
};

exports.uploadSong = function (request, result) {
  // checks if the user is logged in
  if (request.session.user_id) {

    var formData = new formidable.IncomingForm();
    formData.maxFileSize = 200 * 1024 * 1024;
    formData.parse(request, function (error, fields, files) {
      var title = fields.title;
      var description = fields.description;
      var tags = fields.tags;
      var genre = fields.genre;

      var oldPathThumbnail = files.thumbnail.filepath;
      var thumbnail = "public/thumbnails/" + new Date().getTime() + "-" + files.thumbnail.newFilename;
      fileSystem.rename(oldPathThumbnail, thumbnail, function (error) {
        console.log("thumbnail upload error = ", error);
      });
      var oldPathAudio = files.audio.filepath;
      var newPath = "public/audios/" + new Date().getTime() + "-" + files.audio.newFilename;

      fileSystem.rename(oldPathAudio, newPath, function (error) {
        //get user data to save in audios document
        getUser(request.session.user_id, function (user) {
          var currentTime = new Date().getTime();

          //get audio duration
          getAudioDurationInSeconds(newPath).then(function (duration) {
            var hours = Math.floor(duration / 60 / 60);
            var minutes = Math.floor(duration / 60) - (hours * 60);
            var seconds = Math.floor(duration % 60);

            //insert in db

            Audio.create({
              "user": {
                "_id": user._id,
                "name": user.name,
                "image": user.image,
                "subscribers": user.subscribers
              },
              "filePath": newPath,
              "thumbnail": thumbnail,
              "title": title,
              "description": description,
              "tags": tags,
              "genre": genre,
              "createdAt": currentTime,
              "hours": hours,
              "minutes": minutes,
              "seconds": seconds,
              "watch": currentTime,
              "views": 0,
              "playlist": "",
              "likers": [],
              "dislikers": [],
              "comments": []
            }).then(function (data) {
              //insert in users collection too

              User.updateOne({
                "_id": ObjectId(request.session.user_id)
              }, {
                $push: {
                  "audios": {
                    "_id": data.id,
                    "title": title,
                    "views": 0,
                    "thumbnail": thumbnail,
                    "watch": currentTime
                  }
                }
              });
              result.redirect("/");
            });
          });
        });
      });
    });
  } else {
    result.redirect("/login");
  }
};
