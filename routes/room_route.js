//Config
var config = require("../config.js");
//Modules
var express = require('express');
var router = express.Router();
var reputation_module = require('../reputation_module.js');
var middleware_module = require('../middleware_module.js');
//Model
var Room = require('../models/room_model.js');

//Room (/room) - GET
router.get("/:r_number?", function(req, res) {
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
//Room (/room) - POST
router.post('/', middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=config.rep_create_room) {
      var room1 = new Room({room_number: req.body.room_number, coord: req.body.coord});
      room1.save(function (err, RoomObj) {
        if (err) {
          res.sendStatus(500);
        }
        else {
          res.sendStatus(201);
        }
      });
    }
    else {
      res.sendStatus(401);
    }
  })
});
//Room (/room) - DELETE
router.delete("/:r_number?", middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=config.rep_delete_room) {
      Room.remove({ room_number: req.params.r_number }, function(err) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
    else {
      res.sendStatus(401);
    }
  })
});
module.exports = router
