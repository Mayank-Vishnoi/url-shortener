const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const Url = require('../models/Url');
const counterModel = require('../models/counter');
const utility = require('../utility.js');

// @route     POST /api/shorten
// @desc      Create short URL
router.post('/shorten', async (req, res) => {
   const { fullUrl} = req.body;

   // Check long url
   if (validUrl.isUri(fullUrl)) {
      try {
         let url = await Url.findOne({ full: fullUrl }); // unique for each user

         if (url) {
            // short url for this link already exists
            res.json(url);
         } else {
            try {
               let cnt = await counterModel.findOne(); // passing no param will find the first and one and only doc from this collection
               cnt.counter++;
               cnt.save();

               // Create url code
               const urlCode = utility.base62_encode(cnt.counter);
               try {
                  await Url.create({
                     full: fullUrl,
                     short: urlCode,
                  });
   
                  res.redirect('/');
               } catch (err) {
                  res.status(500).json('Server error while adding a document to urls');
               }
            } catch (err) {
               console.error(err);
               res.status(500).json('Server error while accessing counter variable');
            }
         }
      } catch (err) {
         console.error(err);
         res.status(500).json('Server error while accessing long url');
      }
   } else {
      res.status(401).json('Invalid long url');
   }
});


// handle custom urls.
router.post('/custom', async (req, res) => {
   const {fullUrl, shortId} = req.body;

   if (shortId.length <= 6) {
      res.status(401).json('Please enter a custom Id with length greater than or equal to seven and try again!');
   } else if (validUrl.isUri(fullUrl)) {
      try {
         let url = await Url.findOne({ full: fullUrl });
         if (url) {
            url.clicks = 0; // reset clicks
            url.short = shortId;
            url.date = utility.time_now();
            url.save();
            res.redirect('/');
         } else {
            try {
               await Url.create({
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
         res.status(500).json('Server error while accessing long url');
      }
   } else {
      res.status(401).json('Invalid long url');
   }
});

module.exports = router;