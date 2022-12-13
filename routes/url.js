const express = require('express');
const router = express.Router();
const validUrl = require('validator');
const Url = require('../models/Url');
const counterModel = require('../models/counter');
const utility = require('../utility.js');

// @route     POST /api/shorten
// @desc      Create short URL
router.post('/shorten', async (req, res) => {
   const { fullUrl, username} = req.body;

   // Check long url
   if (validUrl.isURL(fullUrl)) {
      try {
         let url = await Url.findOne({ username: username, full: fullUrl }); // unique for each user

         if (url) {
            // short url for this link already exists
            res.json(url);
         } else {
            try {
               let cnt = await counterModel.findOne(); // passing no param will find the first and one and only doc from this collection
               cnt.counter++;
               await cnt.save();

               // Create url code
               const urlCode = utility.base62_encode(cnt.counter);
               try {
                  await Url.create({
                     username: username,
                     full: fullUrl,
                     short: urlCode,
                  });
   
                  res.redirect('/');
               } catch (err) {
                  res.status(500).json('Server error while adding a document to URLs.');
               }
            } catch (err) {
               console.error(err);
               res.status(500).json('Server error while accessing counter variable.');
            }
         }
      } catch (err) {
         console.error(err);
         res.status(500).json('Server error while accessing long URL.');
      }
   } else {
      res.status(401).json('Invalid long URL.');
   }
});


// @route     POST /api/custom
// @desc      Create custom short ID
router.post('/custom', async (req, res) => {
   const {fullUrl, shortId, username} = req.body;

   if (shortId.length <= 6) {
      res.status(401).json('Please enter a custom ID with a length of at least seven characters and try again.');
   } else if (validUrl.isURL(fullUrl)) {
      try {
         let url = await Url.findOne({ username: username, full: fullUrl });
         if (url) {
            url.clicks = 0; // reset clicks
            url.short = shortId;
            url.date = utility.time_now();
            await url.save();
            res.redirect('/');
         } else {
            try {
               await Url.create({
                  username: username,
                  full: fullUrl,
                  short: shortId,
               });

               res.redirect('/');
            } catch (err) {
               res.status(500).json('Server error while adding a document to urls');
            }
         }
      } catch (err) {
         console.error(err);
         res.status(500).json('Server error while accessing long URL.');
      }
   } else {
      res.status(401).json('Invalid long URL.');
   }
});

module.exports = router;