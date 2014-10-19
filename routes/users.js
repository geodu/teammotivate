var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

// Returns a list of all the users.
router.get('/', function(request, response) {
  User.find({}, 'username', function(err, docs) {
    if (err) {
      response.send(err);
    }
    else {
      response.json(docs);
    }
  });
});

// Create a new user.
router.post('/', function(request, response) {
  User.findOne({username: request.body.username}, function(err, doc) {
    if (err) {
      response.send(err);
    }
    else if (doc) {
      response.json({success: false, message: 'User already exists'});
    }
    else if (request.body.password.length < 8) {
      response.json({success: false, message: 'Password must be at least 8 characters'});
    }
    else {
      var newUser = new User({
        username: request.body.username,
        password: request.body.password,
        projects: [],
        tasks: []
      });
      newUser.save(function(err) {
        if (err) {
          response.send(err);
        }
        else {
          response.json({success: true});
        }
      });
    }
  });
});

module.exports = router;
