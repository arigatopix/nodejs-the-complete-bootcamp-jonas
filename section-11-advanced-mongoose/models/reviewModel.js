const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    cratedAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// STATICS use for model constructor
reviewSchema.statics.calcAverage = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // save to Tour model
  await Tour.findByIdAndUpdate(
    { _id: tourId },
    {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    },
  );
};

reviewSchema.post('save', function() {
  // this.constructor === Model { Review }
  // ใช้เรียก statics method
  this.constructor.calcAverage(this.tour);
});

// Populate user and tour fields when query
reviewSchema.pre(/^find/, function(next) {
  // REMEMBER query 2 ต่อ
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
