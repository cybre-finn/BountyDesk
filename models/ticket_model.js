var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ticketSchema = new Schema({
  headline: String,
  content: String,
  contact_email: String,
  user: String,
  vote: Number,
  status: { type : Number, default: 0 },
  created: { type : Date, default: Date.now },
  deadline: { type : Date },
  img: { data: Buffer, contentType: String }
});
module.exports = mongoose.model('tickets', ticketSchema);
