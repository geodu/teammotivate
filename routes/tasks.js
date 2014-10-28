/**
 * Author: Rujia Zha
 */

var express = require('express');
var router = express.Router();

var Projects = require('../models/project').Project;
var Tasks = require('../models/task').Task;
var Users = require('../models/user').User;
var utils = require('../utils');

// Returns all the tasks that a user is responsible for.
router.get('/:id/tasks', utils.loggedIn, function(request, response) {
	Projects.findOne({ _id: request.params.id }).populate('tasks').exec(function(projErr, project) {
		utils.handleError(projErr);
		if (!project) {
			response.json({
				success: false,
				message: 'Project ' + request.params.id + ' cannot be found'
			});
		}
		else {
			response.json({success: true, tasks: project.tasks});
		}
	});
});

// Create a new task.
router.post('/:id/tasks', utils.loggedIn, function(request, response) {
	Projects.findOne( {_id: request.params.id}, function(projErr, project) {
		utils.handleError(projErr);
		if (!project) {
			response.json({
				success: false,
				message: 'Project ' + request.params.id + ' cannot be found'
			});
		}
		else if (project.leader === request.user.username) {
			var newDeadline = new Date(request.body.deadline);
			var newTask = new Tasks({
		    assignee: request.body.assignee,
		  	description: request.body.description,
		  	completion: 0,
		  	etc: request.body.etc,
		  	deadline: new Date(request.body.deadline)
		  });
		  newTask.save(function(error) {
		  	utils.handleError(error);
		 		Projects.update({ _id: request.params.id },
		 			{ $push: {tasks: newTask._id}}, function(err) {
		 			utils.handleError(err);
		 			Users.update({ username: request.body.assignee},
		 				{ $push: { tasks: newTask._id }}, function(err) {
			 			utils.handleError(err);
			 			response.json({success: true});
		 			});
		 		});	
			});
		}
		else {
			response.json({
				success: false,
				message: 'User logged in is not the project leader'
			});
		}
	});
});

// Returns the task specified by an id.
router.get('/:id1/tasks/:id2', utils.loggedIn, function(request, response) {
  Users.findOne( {username: request.user.username}, function(userErr, user) {
  	utils.handleError(userErr);
  	if (user.projects.indexOf(request.params.id1) > -1) {
  		Tasks.findOne( {_id: request.params.id2 }, function(taskErr, foundTask) {
				utils.handleError(taskErr);
				if (!foundTask) {
					response.json({ success: false, message: 'Task cannot be found' });
				}
				else {
					response.json({ success: true, task: foundTask });
				}
			});
  	}
  	else {
  		response.json({
  			success: false,
  			message: 'User does not belong in project' + request.params.id1
  		});
  	}
  });
});

// Edit a task by overwriting the task associated with an id.
router.put('/:id1/tasks/:id2', utils.loggedIn, function(request, response) {
	var editTask = function() {
		var newDeadline = new Date(request.body.deadline);
		Tasks.update({ _id: request.params.id2 }, {
			assignee: request.body.assignee,
			description: request.body.description,
			completion: request.body.completion,
			etc: request.body.etc,
			deadline: newDeadline
		}, function(err, numAffected) {
				utils.handleError(err);
				if (numAffected === 0) {
					response.json({ success: false, message: 'Task was not edited'});
				}
				else {
					response.json({ success: true });
				}
		});
	};

	Tasks.findOne( {_id:request.params.id2 }, function(taskErr, task) {
		utils.handleError(taskErr);
		if (!task) {
			response.json({success: false, message: 'Task cannot be found'});
		}
		else if (task.assignee === request.user.username) {
			editTask();
		}
		else {
			Projects.findOne( {_id:request.params.id1 }, function(projErr, project) {
				utils.handleError(projErr);
				if (!project) {
					response.json({success: false, message: 'Project cannot be found'});
				}
				else if (project.leader === request.user.username) {
					editTask();
				}
				else {
					response.json({
						success:false,
						message: 'User is not the project leader or the task assignee'
					});
				}
			});
		}
	});
});

// Delete a task.
router.delete('/:id1/tasks/:id2', utils.loggedIn, function(request, response) {
	Projects.findOne( { _id: request.params.id1 }, function(projErr, project) {
		utils.handleError(projErr);
		if (!project) {
			response.json({success: false, message: 'Project cannot be found'});
		}
		else if (project.leader === request.user.username) {
			Tasks.findOne({ _id: request.params.id2 }, function(taskErr, task) {
				utils.handleError(taskErr);
				if (!task) {
					response.json({success: false, message: 'Task cannot be found'});
				}
				Tasks.remove({ _id: request.params.id2 }, function(err) {
					utils.handleError(err);
					Projects.update({ _id: request.params.id1 },
						{ $pull: { tasks: request.params.id2 }}, function(err) {
			 			utils.handleError(err);
			 			Users.update({ username: task.assignee},
			 				{ $pull: { tasks: request.params.id2 }}, function(err) {
				 			utils.handleError(err);
				 			response.json({success: true});
			 			});
			 		});	
				});
			});
		}
		else {
			response.json({
				success: false,
				message: 'User logged in is not the project leader'
			});
		}
	});
});

module.exports = router;