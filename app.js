//Modules
var express = require("express");
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

//Models
var User = require('./models/user_model.js');

//Init Express
var app = express();

//app.use directives for parsing
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379
  }),
  secret: '123',
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

//Mongoose initialisiation, TODO Change to nussbaumdb
mongoose.connect('mongodb://localhost/netzzwergdb');

//Auth
passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ name: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!username === user.name && !password === user.password) { return done(null, false); }
      return done(null, user);
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

//Root (/) - GET
app.get("/", function(req, res) {
  res.send("<h1>Nussbaum-Backend</h1>Usage: <a href=\"https://github.com/ikarulus\">https://github.com/ikarulus</a>");
});

//Login-Route
app.get("/login", passport.authenticate('basic', {session: true}), function (req, res) {
  res.sendStatus(200);
});

//The 404 Route
app.get('*', function(req, res){
  res.sendStatus(404);
});

//Start server
var server = app.listen(8080, function () {
  console.log("Listening on port %s...", server.address().port);
});
