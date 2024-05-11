const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { restrictAccess } = require('../middleware/auth');
require('dotenv').config();


// @route     GET /:code
// @desc     take in form data
router.get('/', restrictAccess, (req, res) => {
   // Note that authentication will fail when you restart your server because the session is cleared.
   res.render('../views/index.ejs', {
      username: req.user.username
   });
});


// @route     GET /view
// @desc      View user's generated url history
router.get('/view', restrictAccess, async (req, res) => {
   // You can use the middleware function to check whether a user is logged in before requesting this data
   try {
      const urls = await Url.find({username: req.user.username});
      const baseLink = String(process.env.baseURL);
      res.render('../views/history.ejs', {
         urls: urls,
         baseLink: baseLink
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