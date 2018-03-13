var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roomSchema = new Schema({
  room_number: { type: String, index: { unique: true, dropDups: true }, required: true },
  role: String,
  coord: String
});
module.exports = mongoose.model('rooms', roomSchema);
