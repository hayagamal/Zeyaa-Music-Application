const User = require("../models/users");
const Audio = require("../models/audios");
var ObjectId = require("mongodb").ObjectId;

exports.postRelatedAudios = function (request, result) {
  Audio.find(
    {
      $and: [
        {
          genre: request.query.genre,
        },
        {
          _id: {
            $ne: ObjectId(request.query.audioId),
          },
        },
      ],
    },
    function (error, audios) {
      //shuffle an array
      for (var a = 0; a < audios.length; a++) {
        var x = audios[a];
        var y = Math.floor(Math.random() * (a + 1));
        audios[y] = x;
      }
      result.json(audios);
    }
  );
};
