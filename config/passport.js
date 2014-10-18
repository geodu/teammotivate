module.exports = function(passport, LocalStrategy) {
  passport.use(new LocalStrategy(
  function(username, password, done) {
    return done(null, false, { message: 'testing'});
  }));
}