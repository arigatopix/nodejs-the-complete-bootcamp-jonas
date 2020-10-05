const mongoose = require('mongoose');

// Create simple Tour Model
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour much have a name'],
    unique: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour much have a price']
  }
});

module.exports = mongoose.model('Tour', tourSchema);
