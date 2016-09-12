//Config
var config = require("./config.js");

//Modules
var express = require("express");
var bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var validator = require('validator');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var RedisStore = require('connect-redis')(session);
var middleware_module = require('./middleware_module.js');

//Models
var User = require('./models/user_model.js');

//Init Express
var app = express();

//app.use directives
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    host: '127.0.0.1',
    port: config.redis_port
  }),
  secret: config.session_secret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Mongoose initialisiation
mongoose.connect(config.mongo_connect);

//Auth
passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ name: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      bcrypt.compare(password, user.password, function(err, res) {
        if (res == false) { return done(null, false); }
        else { return done(null, user); }
      });


    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Router
app.use('/user', require('./routes/user_route.js'));
app.use('/ticket', require('./routes/ticket_route.js'));
app.use('/comment', require('./routes/comment_route.js'));
app.use('/room', require('./routes/room_route.js'));
app.use('/device', require('./routes/device_route.js'));

//Root (/) - GET
app.get("/", function(req, res) {
  res.send(config.info_api_root);
});

//Login route
app.get("/login", passport.authenticate('basic', {session: true}), function (req, res) {
  res.sendStatus(200);
});
//Route that shows whether a user is logged in or not
app.get("/isloggedin", middleware_module.checkloggedin, function (req, res) {
  res.sendStatus(200);
});
//Logout route
app.get("/logout", middleware_module.checkloggedin, function (req, res) {
  req.session.destroy();
  req.logout();
  res.sendStatus(200);
});
//The 404 Route
app.get('*', function(req, res){
  res.sendStatus(404);
});

//Start server
var server = app.listen(config.app_port, function () {
  console.log("Listening on port %s...", server.address().port);
});
