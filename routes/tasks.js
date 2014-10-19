var express = require('express');
var router = express.Router();

var Projects = require('../models/project').Project;
var Tasks = require('../models/task').Task;

// Returns all the tasks that a user is responsible for.
router.get('/:id/tasks', function(request, response) {
	var userTasks = [];
	//TODO: find way to increment id's. For now id is a number refers to _id
	Projects.findOne({ _id: request.params.id }, function(projectErr, project) {
		if (projectErr) {
			response.send(projectErr);
		}
		else if (!project) {
			response.send('Project ' + request.params.id + ' cannot be found');
		}
		//TODO: for now ids in tasks array are _id's that are numbers
		taskIdList = project.tasks;
		//for each task in project
		for (var i = 0; i<taskIdList.length; i++) {
			Tasks.findOne({ _id: taskIdList[i] }, function(taskErr, task){
				if (taskErr) {
					response.send(taskErr);
				}
				else if (!task) {
					response.send('Task with id '+ taskIdList[i] + ', which is part of project ' + request.params.id+ ', cannot be found');
				}
				else if (task.assignee === request.session.username) {
					userTasks.push(task);
				}
				else if (i===taskIdList.length-1) {
					response.json({tasks: userTasks}); // return all docs in JSON format
				}
			});
		}
	});
});

// Create a new task.
router.post('/:id/tasks', function(request, response) {
	var newTask = new Tasks({
    assignee: request.body.assignee,
  	description: request.body.description,
  	completion: request.body.completion, 
  	deadline: request.body.deadline,
  });
  newTask.save(function(error) {
  	//TODO: is this error handling right?
  	if (error) {
  		response.send(error);
  	}
  });
  Tasks.findOne({ assignee: request.session.username }, function(taskErr, task) {
  	if (taskErr) {
  		response.send(taskErr);
  	}
  	else if (!task) {
  		response.send('newly saved task cannot be found in database');
  	}
  	if (!(task.assignee === request.body.assignee && task.description === request.body.description && task.completion === request.body.completion && task.deadline===request.body.deadline)){
  		response.send('newly saved task fields do not match with designated field values');
  	}
	 	Projects.findOne({ _id: request.params.id }, function(projectErr, project) {
	 		if (projectErr) {
  			response.send(projectErr);
	 		}
	 		else if (!project) {
	 			response.send('project ' + request.params.id + ' cannot be found');
	 		}

	 		var updatedTasks = project.tasks;
	 		updatedTasks.push(task._id);
	 		//took out numberAffected
	 		Projects.update({ _id: request.params.id }, { tasks: updatedTasks }, function(err) {
	 			//TODO: correct error handling?
	 			if (err) { 
  				response.send(err);
	 			}
	 			response.json({success: true});
	 		});
	 	});
	});
});

// Returns the task specified by an id.
router.get('/:id1/tasks/:id2', function(request, response) {
  //console.log(request.params);
	Tasks.findOne( {_id: request.params.id2 }, function(taskErr, foundTask) {
		if (taskErr) {
			response.send(taskErr);
		}
		else if (!foundTask) {
			response.json({ success: false, task: {} });
		}
		response.json({ success: true, task: foundTask });
	});
});

// Edit a task by overwriting the task associated with an id.
router.post('/:id1/tasks/:id2', function(request, response) {
	//took out numberAffected
	Tasks.update({ _id: request.params.id2 }
		, { assignee: request.body.assignee, description: request.body.description, completion: request.body.completion, deadline: request.body.deadline}
		, function(err) {
			if (err) {
				response.send(err);
			}
			Tasks.findOne({ _id: request.params.id2 }, function(taskErr, task) {
				if (taskErr) {
					response.send(taskErr);
				}
				else if (!task) {
					response.send('Task ' + request.params.id2 + ' not found');
				}
				else if (!(task.assignee === request.body.assignee && task.description === request.body.description && task.completion === request.body.completion && task.deadline===request.body.deadline)){
		  		response.send('newly saved task fields do not match with designated field values');
		  	}
				response.json({ success: true });
			});
	});
});

// Delete a task.
router.delete('/:id1/tasks/:id2', function(request, response) {
	Tasks.remove({ _id: request.params.id2 }, function(err) {
		if (err) {
			response.send(err);
		}
		Tasks.findOne({ _id: request.params.id2 }, function(taskErr, task) {
			if (taskErr) {
				response.send(taskErr);
			}
			else if (!task){
				response.json({ success: true});
			}
			else {
				response.json({success: false});
			}
		})
	})
});

module.exports = router;