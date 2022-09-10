var bcrypt = require("bcryptjs");
const User = require("../models/users");
var bodyParser = require("body-parser");
//const store = require('../models/users');

exports.getSignUp = (request, result, next) => {
  result.render("signup");
};

exports.postSignUp = (request, result, next) => {
  //check if email exists
  User.findOne(
    {
      email: request.body.email,
    },
    function (error, user) {
      if (user == null) {
        //does not exists

        //converts password to hash
        bcrypt.hash(request.body.password, 10, function (error, hash) {
          User.create(
            {
              name: request.body.name,
              email: request.body.email,
              password: hash,
              coverPhoto: "",
              image: "",
              subscribers: 0,
              subscriptions: [],
              playlists: [],
              audios: []
            },
            function (error, data) {
              result.redirect("/login");
            }
          );
        });
      } else {
        //exists
        result.send("Email already exists");
      }
    }
  );
};
