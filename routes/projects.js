var express = require('express');
var router = express.Router();
var Project = require('../models/project').Project;
var User = require('../models/user').User;
var ObjectId = require('mongoose').Types.ObjectId;

// Returns all the projects accessible to a user.
router.get('/', function(request, response) {
	if (request.user) {
		var username = request.user.username;
		User.findOne({username: username}, function(err, docs) {
			if (err) {	
				response.send(err);
			}
			else {
				var projects = docs.projects;
				response.json({success: true, projects: projects})
			}
		})
	}
	else {
		response.status(401).send("Not Authorized");
	}
});

// Create a new project.
router.post('/', function(request, response) {
	if (request.user) {
		var data = request.body;
		var proj = new Project({
			name: data.name,
		  leader: request.user.username,
		  description: data.description,
		  members: data.members,
		  tasks: []
		});
		proj.save(function (err, docs, numAffected) {
			if (err) {
				console.log ('Error on save!')
			}
			else if (!numAffected) {
				response.json({success: false});
			}
			else {
				response.json({success: true, id: docs._id});
			}
		});
	}
	else {
		response.status(401).send("Not Authorized");
	}
});

// Returns the project specified by an id.
router.get('/:id', function(request, response) {
  console.log(request.params);
  var id = request.params.id;
  Project.findOne({id: id}, function(err, docs) {
		if (err) {
			response.json({success: false});
		}
		else {
			response.json({success: true, project: docs});
		}
  })
});

// Edit a project.
router.post('/:id', function(request, response) {
	var id = request.params.id;
	console.log(id);
	var parsedid = ObjectId.fromString(id);
	console.log(parsedid);
	var description = request.body.description;
	var leader = request.body.leader;
	var name = request.body.name;
	Project.update({id: id}, {$set: {name: name, description: description}}, function(err, docs) {
		if (err) {
			response.json({success: false});
		}
		else {
			response.json({success: true, project: docs});
		}
	})
});

// Delete a project.
router.delete('/:id', function(request, response) {
	var id = request.params.id;
	console.log(id);
	var parsedid = ObjectId.fromString(id);
	console.log(parsedid);
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