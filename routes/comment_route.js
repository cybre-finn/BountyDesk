var express = require('express');
var router = express.Router();
var config = require("../config.js");
var reputation_module = require('../reputation_module.js');
var middleware_module = require('../middleware_module.js');
//Model
var Comment = require('../models/comment_model.js');

//Comment (/comment) - GET
app.get("/:ticket_id?", middleware_module.checkloggedin, function(req, res) {
  if (req.params.ticket_id) {
    Comment.find({ 'ticket_id':  req.params.ticket_id}, function (err, comments) {
      res.json(comments);
    })
  }
  else {
    res.sendStatus(404);
  }
});
//Comment (/comment) - POST
app.post('/', middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=5) {
      var comment1 = new Comment({content: req.body.content, user: req.auth_user.name, ticket_id: req.body.ticket_id});
      comment1.save(function (err, commentObj) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      })
    }
    else {
      res.sendStatus(401);
    }
  })
});
//Comment (/comment) - DELETE
app.delete('/:id?', middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=300) {
      Comment.remove({ _id: req.params.id }, function(err) {
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
