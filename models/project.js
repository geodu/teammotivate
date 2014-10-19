var mongoose = require("mongoose")
   ,ObjectId = Schema.ObjectId;

var projectSchema = new mongoose.Schema({
  leader: String,
  name: String,
  description: String,
  tasks: [Number]
});

var project = mongoose.model('Project', projectSchema);

module.exports = {
  Project: project
}