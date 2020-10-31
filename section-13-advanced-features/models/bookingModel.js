const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!.'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!.'],
  },
  price: {
    type: Number,
    require: ['true', 'Booking must have a price.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// POPULATE user and tour document
bookingSchema.pre(/find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });

  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
