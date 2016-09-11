var express = require('express');
var router = express.Router();
var config = require("../config.js");
var reputation_module = require('../reputation_module.js');
var middleware_module = require('../middleware_module.js');
//Model
var Room = require('../models/room_model.js');

//Room (/room) - GET
app.get("/:r_number?", function(req, res) {
  if (req.params.name) {
    Room.findOne({ 'room_number':  req.params.r_number}, function (err, room) {
      if (err) return handleError(err);
      if (room) {
        res.json(room);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    Room.find({}, function (err, rooms) {
      if (err) {
        res.sendStatus(500);
      }
      else {
        res.json(rooms);
      }
    });
  }
});
module.exports = router
