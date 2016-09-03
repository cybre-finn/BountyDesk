var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roomSchema = new Schema({
  room_number: String,
  coord: String
});
module.exports = mongoose.model('rooms', roomSchema);
