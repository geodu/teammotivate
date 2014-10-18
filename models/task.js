var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
  assignee: String,
  description: String,
  completion: Number
});

var task = mongoose.model('Task', taskSchema);

module.exports = {
  Task: task
}