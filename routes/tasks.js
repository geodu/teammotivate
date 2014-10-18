var express = require('express');
var collectionRouter = express.Router();
var resourceRouter = express.Router();

// Returns all the tasks that a user is responsible for.
collectionRouter.get('/', function(request, response) {
});

// Create a new task.
collectionRouter.post('/', function(request, response) {
});

// Returns the task specified by an id.
resourceRouter.get('/', function(request, response) {
});

// Edit a task by overwriting the task associated with an id.
resourceRouter.post('/', function(request, response) {
});

// Delete a task.
resourceRouter.delete('/', function(request, response) {
});

module.exports = {resource: resourceRouter, collection: collectionRouter}