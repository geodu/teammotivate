var express = require('express');
var router = express.Router();

// Returns all the tasks that a user is responsible for.
router.get('/:id/tasks', function(request, response) {
});

// Create a new task.
router.post('/:id/tasks', function(request, response) {
});

// Returns the task specified by an id.
router.get('/:id1/tasks/:id2', function(request, response) {
  console.log(request.params);
});

// Edit a task by overwriting the task associated with an id.
router.post('/:id1/tasks/:id2', function(request, response) {
});

// Delete a task.
router.delete('/:id1/tasks/:id2', function(request, response) {
});

module.exports = router;