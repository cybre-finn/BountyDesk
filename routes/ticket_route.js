//Config
var config = require("../config.js");
//Modules
var express = require('express');
var router = express.Router();
var reputation_module = require('../reputation_module.js');
var middleware_module = require('../middleware_module.js');
var RateLimit = require('express-rate-limit');
var RateLimitRedisStore = require('rate-limit-redis');
var redis = require('redis');

var limiter = new RateLimit({
  store: new RateLimitRedisStore({
    client: redis.createClient(config.redis_url)
  }),
  windowMs: 1 * 60 * 60 * 1000, // 1 hour window
  max: 50, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
});

//Model
var Ticket = require('../models/ticket_model.js');

//Tickets (/ticket) - GET
router.get("/:id?", function (req, res) {
  if (req.params.id) {
    Ticket.findOne({ '_id': req.params.id }, '-img', function (err, ticket) {
      if (err) {
        res.sendStatus(500);
      }
      if (ticket) {
        res.json(ticket);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    Ticket.find({}, '-img', function (err, tickets) {
      if (err) {
        res.sendStatus(500);
      }
      else {
        res.json(tickets);
      }
    }).sort({ created: -1 });
  }
});

//Ticket (/tickets) - POST
router.post('/', limiter, function (req, res) {
  if (req.isAuthenticated()) {
    var ticket1 = new Ticket({
      status: req.body.status, headline: req.body.headline, content: req.body.content,
      contact_email: req.body.contact_email, issuer: req.body.issuer, room: req.body.room,
      user: req.user.name, bounty: req.body.bounty
    });
  }
  else {
    var ticket1 = new Ticket({
      headline: req.body.headline, content: req.body.content,
      contact_email: req.body.contact_email, issuer: req.body.issuer, room: req.body.room
    });
  }
  ticket1.save(function (err, ticketObj) {
    if (err) {
      res.sendStatus(500);
    }
    else {
      res.json(ticketObj);
    }
  });
});

//Ticket (/tickets) - PUT
router.put('/:id', middleware_module.checkloggedin, function (req, res) {
  reputation_module.userrep(req.user.name, function (rep) {
    if (rep >= config.rep_change_ticket) {
      Ticket.update({ _id: req.params.id }, {
        $set: {
          status: req.body.status, headline: req.body.headline, content: req.body.content,
          contact_email: req.body.contact_email, issuer: req.body.issuer, room: req.body.room,
          user: req.user.name, bounty: req.body.bounty
        }
      }, function (err, ticketObj) {
        if (err) {
          res.sendStatus(500);
        }
        else {
          res.json(ticketObj);
        }
      });
    }
    else {
      res.sendStatus(401);
    }
  })
});

//Tickets (/tickets) - DELETE
router.delete("/:id?", middleware_module.checkloggedin, function (req, res) {
  reputation_module.userrep(req.user.name, function (rep) {
    if (rep >= config.rep_delete_ticket) {
      Ticket.remove({ _id: req.params.id }, function (err) {
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
