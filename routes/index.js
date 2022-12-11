const express = require('express');
const router = express.Router();
const config = require('config');
const Url = require('../models/Url');

// take in form data
router.get('/', (req, res) => {
   res.render('../views/index.ejs');
})

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/:code', async (req, res) => {
   try {
      const baseUrl = config.get('baseUrl');
      const urlCode = req.params.code;
      const shortUrl = baseUrl + '/' + urlCode;
      const url = await Url.findOne({ short: shortUrl });

      if (url) {
         url.clicks++;
         url.save();
         res.redirect(url.full);
      } else {
         res.status(404).json('No such url was found');
      }
   } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
   }
});

module.exports = router;