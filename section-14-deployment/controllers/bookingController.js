const stripe = require('stripe');
const config = require('../config');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

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
    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get(
      'host',
    )}/my-tours/?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${
            tour.imageCover
          }`, // ต้องเป็นรูปใน internet
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

const createBookingCheckout = async session => {
  const tour = session.client_reference_id;

  const user = (await User.findOne({ email: session.customer_email }))
    .id;

  const price = session.display_items[0].amount / 100;

  // create booking
  await Booking.create({ tour, user, price });
};

// Request from Stripe after checkout success
exports.webhookCheckout = async (req, res, next) => {
  let event;
  try {
    const signature = req.headers['stripe-signature'];

    event = stripe.webhook.constructEvent(
      req.body,
      signature,
      config.stripe.webhookSecret,
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({
    received: true,
  });
};

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();

//   await Booking.create({ tour, user, price });

//   // Redirect
//   res.redirect(req.originalUrl.split('?')[0]);
// });

// @desc    Get all bookings
// @route   GET /api/v1/bookings/
// @access  Private
exports.getAllBookings = factory.getAll(Booking);

// @desc    Get booking
// @route   GET /api/v1/bookings/:bookingId
// @access  Private
exports.getBooking = factory.getOne(Booking);

// @desc    Create booking
// @route   POST /api/v1/bookings/
// @access  Private
exports.createBooking = factory.createOne(Booking);

// @desc    Update Booking
// @route   PATCH /api/v1/bookings/:bookingId
// @access  Private
exports.updateBooking = factory.updateOne(Booking);

// @desc    Delete Booking
// @route   DELETE /api/v1/bookings/:bookingId
// @access  Private
exports.deleteBooking = factory.deleteOne(Booking);
