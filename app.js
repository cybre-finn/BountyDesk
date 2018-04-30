'use strict';
var cpuCount = require('os').cpus().length;
//Config
var config = require("./config.js");

//Modules
const express = require("express");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const JsonStrategy = require('passport-json').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis')(session);
const middleware_module = require('./middleware_module.js');
const xss = require('xss-clean');
const cluster = require('cluster');
if (cluster.isMaster) {

  for (var i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

} else {

  //Models
  var User = require('./models/user_model.js');

  //Init Express
  var app = express();

  //app.use directives
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.json()); // for parsing application/json
  app.use(xss());

  app.use(cookieParser());
  app.use(session({
    store: new RedisStore({
      url: config.redis_url
    }),
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  //Mongoose initialisiation
  var mongo_options = { auto_reconnect: true, reconnectTries: 100, reconnectInterval: 3000, keepAlive: 120, connectTimeoutMS: 3000 };
  var db = mongoose.connection;
  db.on('connecting', function () {
    console.log('connecting to MongoDB...');
  });
  db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
  });
  db.once('open', function () {
    console.log('MongoDB connection opened!');
  });
  db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });
  db.on('disconnected', function () {
    console.log('MongoDB disconnected!');
    mongoose.connect(config.mongo_connect, mongo_options);
  });
  mongoose.connect(config.mongo_connect, mongo_options);

  //Create bootstrap user
  mongoose.connection.on('connected', function () {
    mongoose.connection.db.collection('users').count(function (err, count) {
      if (count == 0) {
        console.log("Create bootstrap user");
        bcrypt.hash(config.bootstrap_user_password, config.crypt_saltRounds, function (err, hash) {
          if (err) console.log(err);
          else {
            var user1 = new User({ name: "bootstrap", password: hash, rep: config.bootstrap_user_reputation });
            user1.save(function (err, userObj) {
              if (err) console.log(err);
            });
          }
        });
      }
    });
  });
  //Auth
  passport.use(new BasicStrategy(
    function (username, password, done) {
      User.findOne({ name: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function (err, res) {
          if (res == false) { return done(null, false); }
          else { return done(null, user); }
        });


      });
    }
  ));
  passport.use(new JsonStrategy(
    function (username, password, done) {
      User.findOne({ name: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function (err, res) {
          if (res == false) { return done(null, false); }
          else { return done(null, user); }
        });
      });
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });



  //Router
  app.use(express.static(__dirname + '/public'));
  app.use('/users', require('./routes/user_route.js'));
  app.use('/tickets', require('./routes/ticket_route.js'));
  app.use('/comments', require('./routes/comment_route.js'));
  app.use('/rooms', require('./routes/room_route.js'));

  //Root (/) - GET
  app.get("/api", function (req, res) {
    res.send(config.info_api_root);
  });

  //Login route
  app.get("/login", passport.authenticate('basic', { session: true }), function (req, res) {
    res.sendStatus(200);
  });
  //Login route - post
  app.post("/login", passport.authenticate('json', { session: true }), function (req, res) {
    res.json({ user: req.user });
  });
  //Route that shows whether a user is logged in or not
  app.get("/auth", middleware_module.checkloggedin_silent, function (req, res) {
    res.json({ user: req.user });
  });
  //Logout route
  app.post("/logout", middleware_module.checkloggedin, function (req, res) {
    req.session.destroy();
    req.logout();
    res.json({ user: "logged" });
  });
  //The 404 Route
  app.get('*', function (req, res) {
    res.sendFile('public/index.html', { root: __dirname });
  });

  //Start server
  var server = app.listen(config.app_port, function () {
    console.log("Listening on port %s...", server.address().port);
  });
}