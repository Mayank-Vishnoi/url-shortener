const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const config = require('config');
const Url = require('../models/Url');
const counterModel = require('../models/counter');
const encoder = require('../base62.js');

// @route     POST /api/shorten
// @desc      Create short URL
router.post('/shorten', async (req, res) => {
   const { fullUrl} = req.body;
   const baseUrl = config.get('baseUrl');

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
               const urlCode = encoder.base62_encode(cnt.counter);
               const shortUrl = baseUrl + '/' + urlCode;
               await Url.create({
                  full: fullUrl,
                  short: shortUrl,
               });

               res.redirect('/');
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

module.exports = router;