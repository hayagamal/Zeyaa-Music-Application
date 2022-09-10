const Audio = require("../models/audios");
var ObjectId = require("mongodb").ObjectId;

exports.chooseSong = function (request, result) {
  Audio.findOne({
    "watch": parseInt(request.params.watch)
  }, function (error, audio) {
    if (audio == null) {
      result.send("Song does not exist");
    } else {
      //increment views counter
      Audio.updateOne({
        "_id": ObjectId(audio._id)
      }, {
        $inc: {
          "views": 1
        }
      })
      if(request.query.comment && request.session.user_id){
        //audio.comments = [...audio.comments, ]
        audio.comments.push({user:{_id: request.session.user_id, name: "haya gamal"} , comment:request.query.comment , replies:[]});
      }else if(request.query.reply && request.session.user_id){
        let indexOfComment = audio.comments.map((comment) => comment._id.toString()).indexOf(request.query.commentId)
        if(indexOfComment > -1){
          audio.comments[indexOfComment].replies.push({user: {_id: request.session.user_id, name: "haya gamal"}, reply: request.query.reply}) 
        }
      }
      result.render("audio-page/index", {
        "isLogin": request.session.user_id ? true : false,
        "audio": audio
      });
    }
  });
};
