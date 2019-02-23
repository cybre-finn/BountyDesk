//Config
const config = require("../config.js");
//Modules
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const reputation_module = require('../reputation_module.js');
const middleware_module = require('../middleware_module.js');
//Model
const User = require('../models/user_model.js');

//Users (/user) - GET
router.get("/:name?", function(req, res) {
  if (req.params.name) {
    User.findOne({ 'name':  req.params.name}, '-password', function (err, user) {
      if (err) {
        res.sendStatus(500);
      }
      if (user) {
        res.json(user);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    User.find({}, '-password', function (err, users) {
      if (err) {
        res.sendStatus(500);
      }
      else {
        res.json(users);
      }
    });
  }
});

//Users (/user) - PUT
router.put('/:name?', middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=config.rep_create_user) {
      bcrypt.hash(req.body.password, config.crypt_saltRounds, function(err, hash) {
        if (err) { res.sendStatus(500); }
        else {
          var user1 = new User({name: req.body.name, email: req.body.email, real_name: req.body.real_name, password: hash, status: req.body.status,
            rep: req.body.rep});
          user1.save(function (err, userObj) {
            if (err) {
              res.sendStatus(500);
            }
            else {
              res.json(userObj);
            }

          });
        }
      });
    }
    else {
      res.sendStatus(403);
    }
  })
});

//User (/user) - DELETE
router.delete("/:name?", middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=config.rep_delete_user) {
      User.findOne({ 'name':  req.params.name}, '-password', function (err, user) {
        User.remove({ 'name': req.params.name }, function(err) {
          if (err) {
            res.sendStatus(500);
          } else {
            res.json(user);
          }
        });
      });
    }
    else {
      res.sendStatus(403);
    }
  })
});
module.exports = router
