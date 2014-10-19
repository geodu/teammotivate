var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
  leader: String,
  name: String,
  description: String,
  tasks: [String],
  users: [String]
});

var project = mongoose.model('Project', projectSchema);

module.exports = {
  Project: project
}