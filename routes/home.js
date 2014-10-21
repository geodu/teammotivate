var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
  response.sendfile('./public/views/index.html');;
});

module.exports = router;
