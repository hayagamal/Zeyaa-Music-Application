const User = require("../models/users");
var bcrypt = require("bcryptjs");
//var expressSession = require("express-session");

exports.getLogin = function (request, result) {
  result.render("login", {
    error: "",
    message: "",
  });
};

exports.postLogin = function (request, result) {
  // check if email exists
  User.findOne(
    {
      email: request.body.email,
    },
    function (error, user) {
      if (user == null) {
        result.send("Email does not exist");
      } else {
        //compare hashed password
        bcrypt.compare(
          request.body.password,
          user.password,
          function (error, isVerify) {
            if (isVerify) {
              //save user id in session
              request.session.user_id = user._id; //key
              result.redirect("/");
            } else {
              result.send("Password is not correct");
            }
          }
        );
      }
    }
  );
};
