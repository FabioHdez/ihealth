const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const Employee = require('../models/Employee');

passport.use(new LocalStrategy(
  function(username, password, done) {
    Employee.findOne({ username: username }, function (err, user) {
      console.log(user)
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.matchPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Employee.findById(id, (err, user) => {
    done(err, user);
  });
});
