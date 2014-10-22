/**
 * Authors: George Du, Michael Choi, Rujia Zha
 */

 var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  department: String,
  projects: [String],
  tasks: [String]
});

var user = mongoose.model('User', userSchema);

module.exports = {
  User: user
}