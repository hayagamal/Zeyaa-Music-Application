exports.getLogout = function (request, result) {
  request.session.destroy();
  result.redirect("/");
};
