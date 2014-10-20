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
	proj.save(function (err, docs) {
		utils.handleError(err);
		console.log(docs.users);
		for (var i = 0; i < docs.users.length; i++) {
			User.update({username: docs.users[i]}, {$push: {projects: docs._id}}, function (err, docs){
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
		response.json({success: true, project: docs});
  });
});

// Edit a project.
router.post('/:id', utils.loggedIn, function(request, response) {
	var username = request.user.username;
	var id = request.params.id;
	var description = request.body.description;
	var leader = request.body.leader;
	var name = request.body.name;
	Project.update({_id: id, leader: username}, {$set: {name: name, description: description}}, function(err, numUpdated) {
		utils.handleError(err);
		if (numUpdated === 0) {
			response.json({success: false});
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
	Project.remove({_id: id, leader: username}, function(err) {
		utils.handleError(err);
		response.json({success: true});
	});
});

module.exports = router;