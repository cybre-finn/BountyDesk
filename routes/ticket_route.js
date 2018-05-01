//Config
const config = require("../config.js");
//Modules
const express = require('express');
const router = express.Router();
const reputation_module = require('../reputation_module.js');
const middleware_module = require('../middleware_module.js');
const RateLimit = require('express-rate-limit');
const RateLimitRedisStore = require('rate-limit-redis');
const redis = require('redis');
const nodemailer = require('nodemailer');
const limiter = new RateLimit({
  store: new RateLimitRedisStore({
    client: redis.createClient(config.redis_url)
  }),
  windowMs: 1 * 60 * 60 * 1000, // 1 hour window
  max: 50, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
});

//Model
const Ticket = require('../models/ticket_model.js');
const User = require('../models/user_model.js');
const smtpConfig = {
  host: config.smtp_host,
  port: config.smtp_port,
  requireTLS: config.smtp_tls,
  auth: {
    user: config.smtp_user,
    pass: config.smtp_password
  }
};

//Tickets (/ticket) - GET
router.get("/:id?", function (req, res) {
  if (req.params.id) {
    Ticket.findOne({ '_id': req.params.id }, function (err, ticket) {
      if (err) {
        res.sendStatus(500);
      }
      else if (ticket) {
        res.json(ticket);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    let sort = {};
    if (req.query.sort) {
      if (req.query.sort.search("-") == 0) {
        sort[req.query.sort.substring(1)] = -1;
      }
      else sort[req.query.sort] = 1;
      delete req.query.sort;
    }
    if (req.query.limit) {
      let limit = Number(req.query.limit)
      delete req.query.limit;
      Ticket.
        find(req.query).
        limit(limit).
        sort(sort).
        exec(callback);
    }
    else {
      Ticket.
        find(req.query).
        sort(sort).
        exec(callback);
    }
    function callback(err, tickets) {
      if (err) {
        res.sendStatus(500);
      }
      else {
        res.json(tickets);
      }
    };
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
      var transporter = nodemailer.createTransport(smtpConfig);
      var message = {
        from: config.smtp_address,
        to: ticketObj.contact_email,
        subject: 'New support ticket',
        html: 'You just created a support ticket. Take a look and consult for updates here: <a href="' + config.url + 'ticket/'
          + ticketObj._id + '">' + config.url + 'ticket/' + ticketObj._id + '</a>.'
      };
      transporter.sendMail(message, function (err) {
        if (err) console.log(err);
      });
      res.json(ticketObj);
    }
  });
});

//Ticket (/tickets) - PUT
router.put('/:id', middleware_module.checkloggedin, function (req, res) {
  reputation_module.userrep(req.user.name, function (rep) {
    if (rep >= config.rep_change_ticket) {
      Ticket.findById(req.body._id, function (err, ticket) {
        if (err) res.sendStatus(500);
        ticket.set({
          status: req.body.status, headline: req.body.headline, content: req.body.content,
          contact_email: req.body.contact_email, issuer: req.body.issuer, room: req.body.room,
          user: req.user.name, bounty: req.body.bounty, assigned: req.body.assigned
        });
        ticket.save(function (err, ticketObj) {
          if (req.body.status == 4 && ticketObj.assigned && ticketObj.bounty) {
            var id = "";
            var quotient = 0;
            for (var index = 0; index < ticketObj.assigned.length; index++) {
              id = ticketObj.assigned[index]._id;
              quotient = Math.round(ticketObj.bounty / ticketObj.assigned.length);
              User.update({ _id: id }, { $inc: { rep: quotient } }, function (err) {
                if (err) console.error(err);
              });
            }
          }
          if (err) {
            res.sendStatus(500);
          }
          else {
            var transporter = nodemailer.createTransport(smtpConfig);
            var message = {
              from: config.smtp_address,
              to: ticketObj.contact_email,
              subject: 'Updated support ticket ' + ticketObj._id,
              html: 'A ticket has just been updated. Take a look and consult for updates here: <a href="' + config.url + 'ticket/'
                + ticketObj._id + '">' + config.url + 'ticket/' + ticketObj._id + '</a>.'
            };
            transporter.sendMail(message, function (err) {
              if (err) console.log(err);
            });
            res.json(ticketObj);
          }
        });
      });
    }
    else {
      res.sendStatus(403);
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
          res.sendStatus(204);
        }
      });
    }
    else {
      res.sendStatus(403);
    }
  })
});
module.exports = router
