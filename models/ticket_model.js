var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ticketSchema = new Schema({
  headline: String,
  content: String,
  contact_email: String,
  issuer: String,
  room: String,
  bounty: Number,
  status: { type : Number, default: 0 },
  created: { type : Date, default: Date.now },
  deadline: { type : Date }
});
module.exports = mongoose.model('tickets', ticketSchema);
