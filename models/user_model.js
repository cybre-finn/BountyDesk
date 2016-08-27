var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: String,
  email: String,
  prename: String,
  surname: String,
  password: String,
  rep: Number,
  joined: { type : Date, default: Date.now },
  status: String,
  avatar: { data: Buffer, contentType: String }
});
module.exports = mongoose.model('users', userSchema);
