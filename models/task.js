/**
 * Authors: George Du, Michael Choi, Rujia Zha
 */

var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
  assignee: String,
  description: String,
  completion: Number,
  etc: Number,
  deadline: Date
});

var task = mongoose.model('Task', taskSchema);

module.exports = {
  Task: task
}