const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

module.exports = async function (passport) {
   // Local Authentication Strategy Callback
   passport.use(new LocalStrategy({ username: 'username', password: 'password' }, (username, password, done) => {
      // Check if user exists in db       
      User.findOne({ username }).then((user) => {
         // If no user found return error             
         if (!user) { return done(null, false); }
         // Compare passwords             
         bcrypt.compare(password, user.password)
            .then((isMatch) => {
               // If passwords don't match return error          
               if (!isMatch) {
                  return done(null, false);
               }
               // Return authenticated user           
               return done(null, user);
            });
      });
   }));
   // Serialize Passport: store a user's information in the session
   passport.serializeUser(function (user, done) {
      done(null, user.id);
   });
   // retrieve the corresponding user object from your database when subsequent requests are made, allowing you to authenticate those requests with ease.
   passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
         done(err, user);
      });
   });
};   