var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: { type: String, index: { unique: true, dropDups: true}, required:true },
  email: { type: String, index: { unique: true, dropDups: true }},
  real_name: String,
  password: { type: String, required:true },
  rep: { type : Number, default: 0 },
  joined: { type : Date, default: Date.now },
  status: String
});
module.exports = mongoose.model('users', userSchema);
