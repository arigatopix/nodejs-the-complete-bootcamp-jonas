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

// Compound Indexes Preven duplicate review
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// STATICS use for model constructor
reviewSchema.statics.calcAverageRatings = async function(tourId) {
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

  if (stats.length > 0) {
    // save to Tour model
    await Tour.findByIdAndUpdate(
      { _id: tourId },
      {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      },
    );
  } else {
    // กรณีไม่มี review อยุ่เลย
    await Tour.findByIdAndUpdate(
      { _id: tourId },
      {
        ratingsQuantity: 0,
        ratingsAverage: 4.5,
      },
    );
  }
};

reviewSchema.post('save', function() {
  // this.constructor === Model { Review }
  // ใช้เรียก statics method
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
// ใช้ findOneAndUpdate ,findOneAndDelete เพื่อ trigger middleware
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne(); // currnt document
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne();  does NOT work hear, query has already executed

  // รับ this.r จาก pre query
  // execute statics ดึง tour id จาก this.r.tour
  await this.r.constructor.calcAverageRatings(this.r.tour);
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
