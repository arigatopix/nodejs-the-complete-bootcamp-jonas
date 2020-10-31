const Review = require('../models/reviewModel');
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
exports.getAllReviews = factory.getAll(Review);

// @desc    Get all reviews
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

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
