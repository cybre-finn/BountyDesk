//Config
var config = require("../config.js");
//Modules
var express = require('express');
var router = express.Router();
var reputation_module = require('../reputation_module.js');
var middleware_module = require('../middleware_module.js');
//Model
var Comment = require('../models/comment_model.js');

//Comment (/comment) - GET
router.get("/:ticket_id?", middleware_module.checkloggedin, function(req, res) {
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
router.post('/', middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=config.rep_create_comment) {
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
      res.sendStatus(403);
    }
  })
});

//Comment (/comment) - DELETE
router.delete('/:id?', middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=config.rep_delete_comment) {
      Comment.remove({ _id: req.params.id }, function(err) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
    else {
      res.sendStatus(403);
    }
  })
});

module.exports = router
