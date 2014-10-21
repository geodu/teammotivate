var express = require('express');
var router = express.Router();
var Project = require('../models/project').Project;
var User = require('../models/user').User;
var utils = require('../utils');

// Returns all the projects accessible to a user.
router.get('/', utils.loggedIn, function(request, response) {
	var username = request.user.username;
	var userProjects = [];
	User.findOne({username: username}, function(err, docs) {
		utils.handleError(err);
		if (!docs) {
			response.json({success: false, message: 'Not a user'});
		}
		var projects = docs.projects;
		if (projects.length === 0) {
			response.json({success: true, projects: userProjects});
		}
		else {
			Project.find({_id: {$in: projects}}, function(err, proj) {
				utils.handleError(err);
				for (var i = 0; i< proj.length; i++ ) {
					userProjects.push(proj[i]);
				}
				response.json({success: true, projects: userProjects});
			});
		}
	});
});

// Create a new project.
router.post('/', utils.loggedIn, function(request, response) {
	var data = request.body;
	var user = request.user.username;
	if (data.users) {
		data.users.push(user);
	}
	else {
		response.json({success: false, message: 'Need to specify users'});
		return;
	}
	var proj = new Project({
		name: data.name,
	  leader: user,
	  description: data.description,
	  users: data.users,
	  tasks: []
	});
	proj.save(function(err, docs) {
		utils.handleError(err);
		for (var i = 0; i < docs.users.length; i++) {
			User.update({username: docs.users[i]}, {$push: {projects: docs._id}},
				function (err, docs) {
					utils.handleError(err);
			});
		}
		response.json({success: true, id: docs._id});
	});
});

// Returns the project specified by an id.
router.get('/:id', utils.loggedIn, function(request, response) {
  var id = request.params.id;
  Project.findOne({_id: id}, function(err, docs) {
		utils.handleError(err);
		if (!docs) {
			response.json({success: false, message: 'No project found'});
		}
		else if (docs.users.indexOf(request.user.username) === -1) {
			response.json({success: false, message: 'Not a member of the project'});
		}
		else {
			response.json({success: true, project: docs});
		}
  });
});

// Edit a project.
router.post('/:id', utils.loggedIn, function(request, response) {
	var username = request.user.username;
	var id = request.params.id;
	var description = request.body.description;
	var leader = request.body.leader;
	var name = request.body.name;
	var users = request.body.users;
	if (users) {
		users.push(username);
	}
	else {
		response.json({success: false, message: 'Need to specify users'});
		return;
	}
	if (!leader) {
		response.json({success: false, message: 'Need to specify leader'});
		return;
	}

	Project.findOneAndUpdate({_id: id, leader: username}, {$set: {
			name: name,
			description: description,
			leader: leader,
			users: users
		}}, function(err, proj) {
		utils.handleError(err);
		if (!proj) {
			response.json({
				success: false,
				message: 'Only the team leader can edit a project'});
			return;
		}
		else {
			for (var i = 0; i < proj.users.length; i++) {
				if (users.indexOf(proj.users[i]) === -1) {
					User.update({username: proj.users[i]}, {$pull: {projects: id}},
						function (err, docs) {
							utils.handleError(err);
					});
				}
			}
			for (var i = 0; i < users.length; i++) {
				if (proj.users.indexOf(users[i]) === -1) {
					User.update({username: users[i]}, {$push: {projects: id}},
						function (err, docs) {
							utils.handleError(err);
					});
				}
			}
			response.json({success: true});
		}
	});
});

// Delete a project.
router.delete('/:id', utils.loggedIn, function(request, response) {	
	var username = request.user.username;
	var id = request.params.id;
	Project.findById(id, function(err, proj) {
		utils.handleError(err);
		if (!proj) {
			response.json({success: false, message: 'No project of the id found'});
		}
		else if (proj.leader === username) {
			proj.remove();
			for (var i = 0; i < proj.users.length; i++) {
				User.update({username: proj.users[i]}, {$pull: {projects: proj._id}},
					function (err, docs) {
						utils.handleError(err);
				});
			}
			response.json({success: true});
		}
		else {
			response.json({success: false, message: 'Not a leader of the project'});
		}
	});
});

module.exports = router;