var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  projects: [Number],
  tasks: [Number]
});

var user = mongoose.model('User', userSchema);

module.exports = {
  User: user
}