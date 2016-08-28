var mongoose = require('mongoose');
var User = require('./models/user_model.js');
exports.userrep = function (name, done) {
User.findOne({ 'name':  name}, 'rep', function (err, user) {
    if (err) throw(err);

    if (user) {
      return done(user.rep);
    }
    else  {
      console.error("Error fetching reputation data");
    }
  });
};
