var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deviceSchema = new Schema({
  name: String,
  type: String,
  room: String,
  created: { type : Date, default: Date.now },
  status: { type : Number, default: 1 }
});
module.exports = mongoose.model('devices', deviceSchema);
