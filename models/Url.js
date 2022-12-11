const mongoose = require('mongoose');


const UrlSchema = new mongoose.Schema({
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
   date: { 
      type: String,
      default: Date.now
   }
});

module.exports = mongoose.model('Url', UrlSchema);