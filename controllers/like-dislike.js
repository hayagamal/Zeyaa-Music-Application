var app = express();
var http = require("http").createServer(app);

const Audio = require("./models/audios");

app.post("/do-like",function(request,result){
    if(request.session.user_id){
        //check if already liked
        Audio.findOne({
          "_id":ObjectId(request.body.audioId),
          "likers._id": request.session.user_id
        }, function( error, audio){
          if(audio== null){
            // push in likers array
            Audio.updateOne({
              "_id":ObjectId(request.body.audioId)},{

              $push:{
                "likers":{
                  "_id":request.session.user_id
                }
              }
            }, function(error,data){
              result.json({
                  "status":"success",
                  "message":"Song has been liked"
              });
            });
          }
          else{
            result.json({
              "status":"error",
              "message":"Already liked this song"
            });
          }
        });
    } else{
      result.json({
        "status":"error",
        "message":"Please login"
      });
    }
  });
  app.post("/do-dislike",function(request,result){
    if(request.session.user_id){
        //check if already disliked
        Audio.findOne({
          "_id":ObjectId(request.body.audioId),
          "dislikers._id": request.session.user_id
        }, function( error, audio){
          if(audio== null){
            // push in dislikers array
            Audio.updateOne({
              "_id":ObjectId(request.body.audioId)},{

              $push:{
                "dislikers":{
                  "_id":request.session.user_id
                }
              }
            }, function(error,data){
              result.json({
                  "status":"success",
                  "message":"Song has been disliked"
              });
            });
          }
          else{
            result.json({
              "status":"error",
              "message":"Already disliked this song"
            });
          }
        });
    } else{
      result.json({
        "status":"error",
        "message":"Please login"
      });
    }
  });