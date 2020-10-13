const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

// Middleware Pass tourId and userId to Create review
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

// @desc    Get all reviews
// @route   GET /api/v1/reviews/
// @route   GET /api/v1/tours/:tourId/reviews
// @access  Public
exports.getAllReviews = catchAsync(async (req, res, next) => {
  // Find reviews by Tour ID
  let tourFilter = {};
  if (req.params.tourId) tourFilter = { tour: req.params.tourId };

  const features = new APIFeatures(Review.find(tourFilter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;

  // SEND Response
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// @desc    Get all reviews
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new AppError(
        `No Review found with that ID ${req.params.id}`,
        404,
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

// @desc    Create review by tour id
// @route   POST /api/v1/reviews
// @route   POST /api/v1/tours/:tourId/reviews
// @access  Private
exports.createReview = factory.createOne(Review);

// @desc    Update review by id
// @route   PATCH /api/v1/review/:id
// @access  Private
exports.updateReview = factory.updateOne(Review);

// @desc    Delete review by id
// @route   DELETE /api/v1/review/:id
// @access  Private
exports.deleteReview = factory.deleteOne(Review);
