const Audio = require("../models/audios");


exports.getIndex = function (request, result) {
  Audio.find({}).sort({
    "createdAt": -1
  }).then((audios) => {
    result.render("index", {
      "isLogin": request.session.user_id ? true : false,
      "audios": audios
    });
  });
};
