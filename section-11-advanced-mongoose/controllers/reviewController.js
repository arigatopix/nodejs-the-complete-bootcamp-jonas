const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get all reviews
// @route   GET /api/v1/reviews/
// @access  Public
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
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
exports.createReview = catchAsync(async (req, res, next) => {
  // take review, rating from clien
  const { review, rating } = req.body;

  // take user from protect middlware
  const user = req.user.id;

  // take tour from url
  const tour = req.params.tourId || req.body.tour;

  if (!review || !rating) {
    return next(new AppError('Review and Rating can not empty', 400));
  }

  const newReview = await Review.create({
    review,
    rating,
    tour,
    user,
  });

  if (!newReview) {
    return next(new AppError('Create review do not success', 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

// @desc    Update review by id
// @route   PATCH /api/v1/review/:id
// @access  Private
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

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

// @desc    Delete review by id
// @route   DELETE /api/v1/review/:id
// @access  Private
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

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
    data: {},
  });
});
