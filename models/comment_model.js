const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  content: String,
  user: String,
  ticket_id: String,
  vote: Number,
  created: { type : Date, default: Date.now }
});
module.exports = mongoose.model('comments', commentSchema);
