const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileId = mongoose.Types.ObjectId();
const ticketSchema = new Schema({
  headline: String,
  content: String,
  contact_email: String,
  issuer: String,
  room: String,
  bounty: Number,
  assigned: [{
    name: String
  }],
  status: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  deadline: { type: Date },
});
ticketSchema.index({ headline: 'text', content: 'text', issuer: 'text', contact_email: 'text', room: 'text'});
module.exports = mongoose.model('tickets', ticketSchema);
