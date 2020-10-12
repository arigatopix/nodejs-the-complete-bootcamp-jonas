const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

// Include other resource routers
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// *Re-Route into other resource routers
router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour,
  );

module.exports = router;
