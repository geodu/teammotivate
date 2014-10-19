var express = require('express');
var router = express.Router();

var Projects = require('../models/project').Project;
var Tasks = require('../models/task').Task;
var Users = require('../models/user').User;
var utils = require('../utils');

// Returns all the tasks that a user is responsible for.
router.get('/:id/tasks', utils.loggedIn, function(request, response) {
	var userTasks = [];
	Projects.findOne({ _id: request.params.id }, function(projectErr, project) {
		utils.handleError(projectErr);
		else if (!project) {
			response.send('Project ' + request.params.id + ' cannot be found');
			return;
		}
		taskIdList = project.tasks;
		//for each task in project
		for (var i = 0; i < taskIdList.length; i++) {
			Tasks.findOne({ _id: taskIdList[i] }, function(taskErr, task) {
				utils.handleError(taskErr);
				else if (!task) {
					console.log('Task with id '+ taskIdList[i] + ', which is part of project ' + request.params.id+ ', cannot be found');
				}
				else if (task.assignee === request.user.username) {
					userTasks.push(task);
				}
			});
		}
		response.json({tasks: userTasks}); // return all docs in JSON format
	});
});

// Create a new task.
router.post('/:id/tasks', utils.loggedIn, function(request, response) {
	var newDeadline = new Date(request.body.deadline);
	var newTask = new Tasks({
    assignee: request.body.assignee,
  	description: request.body.description,
  	completion: request.body.completion, 
  	deadline: new Date(request.body.deadline)
  });
  newTask.save(function(error) {
  	utils.handleError(error);
 		Projects.update({ _id: request.params.id }, { $push: { tasks: newTask._id }}, function(err) {
 			utils.handleError(err);
 			Users.update({ username: request.user.username}, { $push: { tasks: newTask._id }}, function(err) {
	 			utils.handleError(err);
	 			else {
	 				response.json({success: true});
	 			}
 			});
 		});	
	});
});

// Returns the task specified by an id.
router.get('/:id1/tasks/:id2', function(request, response) {
  //console.log(request.params);
	Tasks.findOne( {_id: request.params.id2 }, function(taskErr, foundTask) {
		utils.handleError(taskErr);
		else if (!foundTask) {
			response.json({ success: false });
		}
		else {
			response.json({ success: true, task: foundTask });
		}
	});
});

// Edit a task by overwriting the task associated with an id.
router.post('/:id1/tasks/:id2', function(request, response) {
	var newDeadline = new Date(request.body.deadline);
	Tasks.update({ _id: request.params.id2 }, {
		assignee: request.body.assignee,
		description: request.body.description,
		completion: request.body.completion,
		deadline: newDeadline}, function(err, numAffected) {
			utils.handleError(err);
			else if (numAffected === 0) {
				response.json({ success: false});
			}
			else {
				response.json({ success: true });
			}
	});
});

// Delete a task.
router.delete('/:id1/tasks/:id2', utils.loggedIn, function(request, response) {
	Tasks.remove({ _id: request.params.id2 }, function(err) {
		utils.handleError(err);
		else {
			Projects.update({ _id: request.params.id1 }, { $pull: { tasks: request.params.id2 }}, function(err) {
	 			utils.handleError(err);
	 			Users.update({ username: request.user.username}, { $pull: { tasks: request.params.id2 }}, function(err) {
		 			utils.handleError(err);
		 			else {
		 				response.json({success: true});
		 			}
	 			});
	 		});	
		}
	});
});

module.exports = router;