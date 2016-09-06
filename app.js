//Modules
var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var validator = require('validator');
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var reputation_module = require('./reputation_module.js');

var User = require('./models/user_model.js');
var Ticket = require('./models/ticket_model.js');
var Comment = require('./models/comment_model.js');
var Room = require('./models/room_model.js');
var Device = require('./models/device_model.js');

//Init Express
var app = express();

//app.use directives for parsing
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Mongose initialisiation
//TODO: Change to nussbaumdb
mongoose.connect('mongodb://localhost/netzzwergdb');

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Auth
passport.use(new Strategy(
  function(userid, password, done) {
    User.findOne({ 'name': userid }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

//Root (/) - GET
app.get("/", function(req, res) {
  res.send("<h1>Nussbaum-Backend</h1>Usage: <a href=\"https://github.com/ikarulus\">https://github.com/ikarulus</a>");
});

//Users (/user) - GET
app.get("/user/:name?", function(req, res) {
  if (req.params.name) {
    User.findOne({ 'name':  req.params.name}, '-password -avatar', function (err, user) {
      if (err) return handleError(err);

      if (user) {
        res.send(user);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    User.find({}, '-password -avatar', function (err, users) {
      res.send(users);
    });
  }
});

//Users (/user) - POST
app.post('/user', passport.authenticate('basic', { session: false }), function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=200) {
      var user1 = new User({name: req.body.name, email: req.body.email, prename: req.body.prename, surname: req.body.surname, password: req.body.password, status: req.body.status});
      user1.save(function (err, userObj) {
        if (err) {
          res.send("Error creating user");
        } else {
          res.json(userObj);
        }
      });
    }
    else {
      res.sendStatus(401);
    }
  })
});
//Tickets (/ticket) - GET
app.get("/ticket/:id?", function(req, res) {
  if (req.params.id) {
    Ticket.findOne({ '_id':  req.params.id}, '-img', function (err, ticket) {
      if (err) return handleError(err);

      if (ticket) {
        res.send(tickets);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    Ticket.find({}, '-img', function(err, tickets) {
      res.send(tickets);
    });
  }
});
//Tickets (/ticket) - DELETE
app.delete("/ticket/:id?", passport.authenticate('basic', { session: false }), function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=1000) {
      Ticket.remove({ _id: req.body.ticket_id }, function(err) {
        if (err) {
          res.send("Error deleting ticket");
        } else {
          res.send("Success")
        }
        });
    }
    else {
      res.sendStatus(401);
    }
  })
});

//Ticket (/ticket) - POST
app.post('/ticket', passport.authenticate('basic', { session: false }), function(req, res) {
  var ticket1 = new Ticket({headline: req.body.headline, content: req.body.content, contact_email: req.body.contact_email, user: req.auth_user.name});
  ticket1.save(function (err, ticketObj) {
    if (err) {
      res.send("Error creating ticket");
    } else {
      res.json(ticketObj);
    }
  });
});

//Comment (/comment) - GET
app.get("/comment/:ticket_id?", passport.authenticate('basic', { session: false }), function(req, res) {
  if (req.params.ticket_id) {
    Comment.find({ 'ticket_id':  req.params.ticket_id}, function (err, comments) {
      res.send(comments);
    })
  }
  else {
    res.sendStatus(404);
  }
});

//Comment (/comment) - POST
app.post('/comment', passport.authenticate('basic', { session: false }), function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=5) {
      var comment1 = new Comment({content: req.body.content, user: req.auth_user.name, ticket_id: req.body.ticket_id});
      comment1.save(function (err, commentObj) {
        if (err) {
          res.send("Error creating comment");
        } else {
          res.json(commentObj);
        }
      })
    }
    else {
      res.sendStatus(401);
    }
  })
});
//Comment (/comment) - DELETE
app.delete('/comment', passport.authenticate('basic', { session: false }), function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=300) {
      Comment.remove({ _id: req.body.comment_id }, function(err) {
        if (err) {
          res.send("Error deleting comment");
        } else {
          res.send("Success")
        }
        });
    }
    else {
      res.sendStatus(401);
    }
  })
});
//Room (/room) - GET
app.get("/room/:r_number?", function(req, res) {
  if (req.params.name) {
    Room.findOne({ 'room_number':  req.params.r_number}, function (err, room) {
      if (err) return handleError(err);

      if (room) {
        res.send(room);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    Room.find({}, function (err, rooms) {
      res.send(rooms);
    });
  }
});

//Device (/device) - GET
app.get("/device/:device_id?", function(req, res) {
  if (req.params.name) {
    Device.findOne({ '_id':  req.params.device_id}, function (err, device) {
      if (err) return handleError(err);

      if (device) {
        res.send(device);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    Device.find({}, function (err, devices) {
      res.send(devices);
    });
  }
});

//The 404 Route
app.get('*', function(req, res){
  res.sendStatus(404);
});

//Start server
var server = app.listen(8080, function () {
  console.log("Listening on port %s...", server.address().port);
});
