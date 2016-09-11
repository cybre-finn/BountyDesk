//Config
var config = require("../config.js");
//Modules
var express = require('express');
var router = express.Router();
var reputation_module = require('../reputation_module.js');
var middleware_module = require('../middleware_module.js');
//Model
var Device = require('../models/device_model.js');

//Device (/device) - GET
router.get("/:device_id?", function(req, res) {
  if (req.params.name) {
    Device.findOne({ '_id':  req.params.device_id}, function (err, device) {
      if (err) return handleError(err);
      if (device) {
        res.json(device);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    Device.find({}, function (err, devices) {
      if (err) {
        res.sendStatus(500);
      }
      else {
        res.json(devices);
      }
    });
  }
});
module.exports = router
