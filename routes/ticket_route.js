var express = require('express');
var router = express.Router();
var config = require("../config.js");
var reputation_module = require('../reputation_module.js');
var middleware_module = require('../middleware_module.js');
//Model
var Ticket = require('../models/ticket_model.js');

//Tickets (/ticket) - GET
router.get("/:id?", middleware_module.checkloggedin, function(req, res) {
  if (req.params.id) {
    Ticket.findOne({ '_id':  req.params.id}, '-img', function (err, ticket) {
      if (err) {
        res.sendStatus(500);
      }
      if (ticket) {
        res.json(tickets);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    Ticket.find({}, '-img', function(err, tickets) {
      if (err) {
        res.sendStatus(500);
      }
      else {
        res.json(tickets);
      }
    });
  }
});
//Ticket (/ticket) - POST
router.post('/', middleware_module.checkloggedin, function(req, res) {
  var ticket1 = new Ticket({headline: req.body.headline, content: req.body.content, contact_email: req.body.contact_email, user: req.auth_user.name});
  ticket1.save(function (err, ticketObj) {
    if (err) {
      res.sendStatus(500);
    }
    else {
      res.sendStatus(201);
    }
  });
});
//Tickets (/ticket) - DELETE
router.delete("/:id?", middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=1000) {
      Ticket.remove({ _id: req.params.id }, function(err) {
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
