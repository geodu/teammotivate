/**
 * Authors: George Du, Michael Choi, Rujia Zha
 */

var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
  leader: String,
  name: String,
  description: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  users: [String]
});

var project = mongoose.model('Project', projectSchema);

module.exports = {
  Project: project
}