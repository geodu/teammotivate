var express = require('express');
var collectionRouter = express.Router();
var resourceRouter = express.Router();

// Returns all the projects accessible to a user.
collectionRouter.get('/', function(request, response) {
});

// Create a new project.
collectionRouter.post('/', function(request, response) {
});

// Returns the project specified by an id.
resourceRouter.get('/', function(request, response) {
});

// Edit a project.
resourceRouter.post('/', function(request, response) {
});

// Delete a project.
resourceRouter.delete('/', function(request, response) {
});

module.exports = {resource: resourceRouter, collection: collectionRouter}