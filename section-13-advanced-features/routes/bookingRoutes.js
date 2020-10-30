const express = require('express');
const bookingControllers = require('../controllers/bookingControllers');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingControllers.getCheckoutSession,
);

module.exports = router;
