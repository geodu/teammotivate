var express = require('express');
var router = express.Router();
var Project = require('../models/project');
var User = require('../models/user');

// Returns all the projects accessible to a user.
router.get('/', function(request, response) {
	var username = request.body.username;
	User.findOne({'username': username}, function(err, docs) {
		if (err) {
			response.json({success: false, projects: []]});
		}
		else {
			var projects = docs.projects;
			response.json({success: true, projects: projects})
		}
	})
});

// Create a new project.
router.post('/', function(request, response) {
	var data = request.body;
	var proj = new Project({
	  leader: data.leader,
	  description: data.description
	});
	proj.save(function (err) {

		if (err) {
			console.log ('Error on save!')
		}
	});
});

// Returns the project specified by an id.
router.get('/:id', function(request, response) {
  console.log(request.params);
  var id = request.params.id;
  Project.findOne({id: id}, function(err, docs) {
		if (err) {
			response.json({success: false, name: '', tasks: []});
		}
		else {
			var name = docs.name;
			var tasks = docs.tasks;
			response.json({success: true, project: docs});
		}
  })
});

// Edit a project.
router.post('/:id', function(request, response) {
	var id = request.params.id;
	var description = request.body.description;
	var leader = request.body.leader;
	var name = request.body.name;
	Project.update({id: id}, {$set: {name: name, description: description}}, function(err, docs) {
		if (err) {
			response.json({success: false, name: docs.name, description: docs.description})
		}
		else {
			response.json({success: true, name: docs.name, description: docs.description})
		}
	})
});

// Delete a project.
router.delete('/:id', function(request, response) {
  var id = request.params.id;
	Project.remove({id: id}, function(err) {
		if (err) {
			response.json({success: false});
		}
		else {
			response.json({success: true});
		}
	})
});

module.exports = router;