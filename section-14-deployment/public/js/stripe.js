/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Stripe Libraries
const stripe = Stripe(
  'pk_test_51HhyOFIN9xs379EEfNlzJxqZImj3toXjDq9kOCLCBwJbj3x7PmebPuYpGRXI3SCX4kFYe0FSjVanJvND3Y9vVCzn00KT3ZSA8Y',
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const res = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    // console.log(res);

    // 2) Create checkout from + charge credit card
    await stripe.redirectToCheckout({
      sessionId: res.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
