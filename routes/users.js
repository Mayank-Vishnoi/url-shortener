const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const passport = require('passport');


// register
router.get('/register', (req, res) => {
   res.render('../views/register.ejs');
});


// register post
router.post('/register', async (req, res) => {
   async function foundDuplicate(name) {
      const duplicate = await User.findOne({ username: name });
      return !!duplicate;
   }
   let newUser = {
      username: req.body.username,
      password: req.body.password
   };
   try {
      if (await foundDuplicate(newUser.username)) {
         res.status(400).json('Another user with same name exists!');
      } else {
         try {
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            const user = new User({
               username: newUser.username,
               password: hashedPassword
            });
            await user.save();
            req.flash('success', 'You have successfully registered.'); // saves a key pair
            res.redirect('/users/login'); 
         } catch (e) {
            console.log(e);
            res.render('../views/register.ejs');
         }
      }
   } catch (e) {
      res.status(500).json('There was a server error while checking for the username in the database.');
   }
});   


// Login
router.get('/login', (req, res) => {
   res.render('../views/login.ejs');
});


// login POST
router.post('/login', (req, res) => {
   req.flash('error', 'Invalid credentials');
   passport.authenticate('local', {
      successFlash: true,
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res); 
});


// Logout 
router.get('/logout', (req, res) => {
   req.isAuthenticated();
   req.flash('success', 'You are now logged Out');
   res.redirect('/users/login');
});

module.exports = router;