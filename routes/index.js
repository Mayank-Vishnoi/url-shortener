const express = require('express');
const router = express.Router();
const Url = require('../models/Url');


// Middleware to check if a user whose requesting this route is authenticated
const checkAuthentication = (req, res, next) => {
   if (req.isAuthenticated()) {
      next();
   } else {
      req.flash('error', 'You Have to be Logged in to avail this service');
      res.redirect('/users/login');
   }
};


// take in form data
// Note that authentication would fail once you restart your server
router.get('/', checkAuthentication, (req, res) => {
   res.render('../views/index.ejs', {
      username: req.user.username
   });
});


// // You can use the middleware function to check whether a user is logged in before requesting this data
// router.post('/view', checkAuthentication, (req, res) => {
//    // fill in the details, send them to render
//    res.render('../views/history.ejs', {
//       username: req.user.username
//    });
// });


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
         res.status(404).json('No such url was found');
      }
   } catch (err) {
      console.error(err);
      res.status(500).json('Server error while searching for short id');
   }
});


module.exports = router;