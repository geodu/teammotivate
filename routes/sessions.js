var express = require('express');
var User = require('../models/user').User;

var Router = function(passport) {
  var router = express.Router();

  // Returns a list of all the users.
  router.post('/', passport.authenticate('local'), function(request, response) {
    response.json({success: true});
  });

  return router;
}

module.exports = Router;
