const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const {setUser} = require('../service/auth');
const { checkAuthentication } = require('../middleware/auth');


// @route GET /users/register
// @desc Registration page
router.get('/register', (req, res) => {
   res.render('../views/register.ejs');
});


// @route POST /users/register
// @desc Register a new user
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


// @route GET /users/login
// @desc Login page
router.get('/login', checkAuthentication, (req, res) => {
   if (req.user) {
      req.flash('success', 'You are already logged in');
      return res.redirect('/');
   }
   res.render('../views/login.ejs');
});


// @route POST /users/login
// @desc Login user
router.post('/login', async (req, res) => {
   username = req.body.username;
   password = req.body.password;
   // Check if user exists in db       
   await User.findOne({ username }).then((user) => {
      // If no user found return error             
      if (!user) {
         req.flash('error', 'Invalid username');
         return res.redirect('/users/login');
      }
      // Compare passwords             
      bcrypt.compare(password, user.password)
         .then((isMatch) => {
            // If passwords don't match return error          
            if (!isMatch) {
               req.flash('error', 'Invalid password');
               return res.redirect('/users/login');
            }

            // Store user in session
            const sessionId = uuidv4();
            setUser(sessionId, user);
            // req.session.userId = sessionId;
            res.cookie('uid', sessionId);

            // Return authenticated user
            req.flash('success', 'You are now logged in');       
            return res.redirect('/');
         });
   });
});


// @route GET /users/logout
// @desc Logout user
router.get('/logout', checkAuthentication, (req, res) => {
   if (!req.user) {
      req.flash('success', 'You are already logged out');
   } else {
      res.clearCookie('uid');
      req.flash('success', 'You are now logged out');
   }
   return res.redirect('/users/login');
});


module.exports = router;