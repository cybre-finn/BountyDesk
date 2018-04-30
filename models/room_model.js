const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
  room_number: { type: String, index: { unique: true, dropDups: true }, required: true },
  role: String,
  coord: String
});
module.exports = mongoose.model('rooms', roomSchema);
