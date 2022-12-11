const mongoose = require('mongoose');

const cntSchema = new mongoose.Schema({
   counter: {
      type: Number
   }
});

module.exports = mongoose.model('counterModel', cntSchema);