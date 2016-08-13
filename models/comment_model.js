var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    content: String,
    user: String,
    ticket_id: String,
    vote: Number,
    created: { type : Date, default: Date.now }
    });
module.exports = mongoose.model('comments', commentSchema);