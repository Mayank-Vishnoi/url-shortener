const express = require('express');
const router = express.Router();
const Url = require('../models/Url');

// take in form data
router.get('/', (req, res) => {
   res.render('../views/index.ejs');
})

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/:code', async (req, res) => {
   try {
      const url = await Url.findOne({ short: req.params.code });

      if (url) {
         url.clicks++;
         url.save();
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