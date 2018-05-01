//Config
const config = require("../config.js");
//Modules
const express = require('express');
const router = express.Router();
const reputation_module = require('../reputation_module.js');
const middleware_module = require('../middleware_module.js');
//Model
const Comment = require('../models/comment_model.js');

//Comment (/comments) - GET
router.get("/", function (req, res) {
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
    Comment.
      find(req.query).
      limit(limit).
      sort(sort).
      exec(callback);
  }
  else {
    Comment.
      find(req.query).
      sort(sort).
      exec(callback);
  }
  function callback(err, comments) {
    if (err) res.sendStatus(500);
    res.json(comments);
  }
});

//Comment (/comment) - POST
router.post('/', middleware_module.checkloggedin, function (req, res) {
  reputation_module.userrep(req.user.name, function (rep) {
    if (rep >= config.rep_create_comment) {
      var comment1 = new Comment({ content: req.body.content, user: req.user.name, ticket_id: req.body.ticket_id });
      comment1.save(function (err, commentObj) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.json(commentObj);;
        }
      })
    }
    else {
      res.sendStatus(403);
    }
  })
});

//Comment (/comment) - DELETE
router.delete('/:id?', middleware_module.checkloggedin, function (req, res) {
  reputation_module.userrep(req.user.name, function (rep) {
    if (rep >= config.rep_delete_comment) {
      Comment.remove({ _id: req.params.id }, function (err) {
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
