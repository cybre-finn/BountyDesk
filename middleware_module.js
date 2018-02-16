var passport = require('passport');
exports.checkloggedin = function checkloggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  passport.authenticate('basic', {session: false})(req, res, next);
}
exports.checkloggedin_silent = function checkloggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}
