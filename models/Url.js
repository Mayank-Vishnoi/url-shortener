const mongoose = require('mongoose');
const utility = require('../utility.js');

const UrlSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true
   },
   full: {
      type: String,
      required: true
   },
   short: {
      type: String,
      required: true,
   },
   clicks: {
      type: Number,
      required: true,
      default: 0
   },
   time: { 
      type: String,
      required: true,
      default: utility.time_now()
   }
});

module.exports = mongoose.model('Url', UrlSchema); 