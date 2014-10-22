/**
 * Author: George Du
 */

var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/test', function(request, response) {
  response.sendFile(path.join(__dirname, '../public', '/test/testing.html'));
});

router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public', '/views/index.html'));
});

module.exports = router;
