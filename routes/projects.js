var express = require('express');
var collectionRouter = express.Router();
var resourceRouter = express.Router();

collectionRouter.get('/', function(request, response) {

});

resourceRouter.get('/', function(request, response) {

});

module.exports = {resource: resourceRouter, collection: collectionRouter}