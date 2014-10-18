var express = require('express');
var router = express.Router();

// Returns all the projects accessible to a user.
router.get('/', function(request, response) {
});

// Create a new project.
router.post('/', function(request, response) {
});

// Returns the project specified by an id.
router.get('/:id', function(request, response) {
  console.log(request.params);
});

// Edit a project.
router.post('/:id', function(request, response) {
});

// Delete a project.
router.delete('/:id', function(request, response) {
});

module.exports = router;