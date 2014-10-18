var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
  leader: String,
  description: String,
  tasks: [Number]
});

var project = mongoose.model('Project', projectSchema);

module.exports = {
  Project: project
}