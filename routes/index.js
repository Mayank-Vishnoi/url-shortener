const express = require('express');
const router = express.Router();
const Url = require('../models/Url');


// Middleware to check if the user requesting this route is authenticated
const checkAuthentication = (req, res, next) => {
   if (req.isAuthenticated()) {
      next();
   } else {
      req.flash('error', 'You have to be logged in to avail of this service.');
      res.redirect('/users/login');
   }
};


// @route     GET /:code
// @desc     take in form data
// Note that authentication will fail when you restart your server.
router.get('/', checkAuthentication, (req, res) => {
   res.render('../views/index.ejs', {
      username: req.user.username
   });
});


// You can use the middleware function to check whether a user is logged in before requesting this data
router.get('/view', checkAuthentication, async (req, res) => {
   // fill in the details, send them to render
   try {
      const urls = await Url.find({username: req.user.username});
      res.render('../views/history.ejs', {
         urls: urls
      });
   } catch (err) {
      res.status(500).json('There was a server error while fetching user documents.');
   }
});


// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/:code', async (req, res) => {
   try {
      // short is unique regardless of the user
      const url = await Url.findOne({ short: req.params.code });

      if (url) {
         url.clicks++;
         await url.save();
         res.redirect(url.full);
      } else {
         res.status(404).json('No such url was found.');
      }
   } catch (err) {
      console.error(err);
      res.status(500).json('There was a server error while searching for the short ID.');
   }
});


module.exports = router;