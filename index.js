var express = require('express');
var path = require('path');
var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongo = require('mongodb');
var mongoose = require('mongoose');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'asDni2324nasdSDSf',
  resave: true,
  saveUninitialized: true
}));
passport.use(new LocalStrategy(
  function(username, password, done) {
    return done(null, false, { message: 'testing'});
  }));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', passport.authenticate('local', {
    successRedirect : '/profile',
    failureRedirect : '/signup'
  }));

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
  process.env.OPENSHIFT_NODEJS_IP);
