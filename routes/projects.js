var express = require('express');
var router = express.Router();
var Project = require('../models/project').Project;
var User = require('../models/user').User;
var utils = require('../utils');

// Returns all the projects accessible to a user.
router.get('/', utils.loggedIn, function(request, response) {
	var username = request.user.username;
	User.findOne({username: username}, function(err, docs) {
		utils.handleError(err);
		var projects = docs.projects;
		response.json({success: true, projects: projects});
	});
});

// Create a new project.
router.post('/', utils.loggedIn, function(request, response) {
	var data = request.body;
	console.log(data);
	var user = request.user.username;
	if (data.users) {data.users.push(user);}
	var proj = new Project({
		name: data.name,
	  leader: user,
	  description: data.description,
	  users: data.users,
	  tasks: []
	});
	proj.save(function(err, docs) {
		utils.handleError(err);
		console.log(docs.users);
		for (var i = 0; i < docs.users.length; i++) {
			User.update({username: docs.users[i]}, {$push: {projects: docs._id}}, function (err, docs) {
				utils.handleError(err);
			});
		}
		response.json({success: true, id: docs._id});
	});
});

// Returns the project specified by an id.
router.get('/:id', utils.loggedIn, function(request, response) {
  console.log(request.params);
  var id = request.params.id;
  Project.findOne({_id: id}, function(err, docs) {
		utils.handleError(err);
		if (!docs) {
			response.json({success: false, message: 'no project found'});
		}
		else if (docs.users.indexOf(request.user.username) === -1) {
			response.json({success: false, message: 'not a member of the project'});
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
	Project.update({_id: id, leader: username}, {$set: {name: name, description: description, leader: leader, users: users}}, function(err, numUpdated) {
		utils.handleError(err);
		if (numUpdated === 0) {
			response.json({success: false, message: 'not your project'});
		}
		else {
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
			console.log(proj);
			proj.users
			proj.remove();
			for (var i = 0; i < proj.users.length; i++) {
				User.update({username: proj.users[i]}, {$pull: {projects: proj._id}}, function (err, docs) {
					utils.handleError(err);
				});
			}
			response.json({success: true});
		}
		else {
			response.json({success: false, message: 'Not a leader of the project'});
		}
	})
	// Project.remove({_id: id, leader: username}, function(err) {
	// 	utils.handleError(err);
	// 	response.json({success: true});
	// });
});

module.exports = router;