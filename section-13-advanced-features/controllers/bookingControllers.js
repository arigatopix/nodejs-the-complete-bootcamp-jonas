const stripe = require('stripe');
const config = require('../config');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Log user in
// @route   GET /api/v1/bookings/checkout-session/:tourId
// @access  Private
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('Can not find resources', 404));
  }

  // 2) Create checkout session
  const session = await stripe(
    config.stripe.secret,
  ).checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `https://www.natours.dev/img/tours/${tour.imageCover}`, // ต้องเป็นรูปใน internet
        ],
        amount: tour.price * 100, // usd to cent
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
