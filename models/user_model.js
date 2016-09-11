var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: { type: String, index: { unique: true, dropDups: true }},
  email: { type: String, index: { unique: true, dropDups: true }},
  prename: String,
  surname: String,
  password: String,
  rep: { type : Number, default: 0 },
  joined: { type : Date, default: Date.now },
  status: String,
  avatar: { data: Buffer, contentType: String }
});
module.exports = mongoose.model('users', userSchema);
