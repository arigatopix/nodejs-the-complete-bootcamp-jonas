const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

// Include other resource routers
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// POST tours/323e0d/reviews
// GET tours/323e0d/reviews

// *Re-Route into other resource routers
router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

// tour-within/:distance/center/:latlong/unit/:unit
// tour-within/500/center/34.11745,-118.113491/unit/mi
router
  .route('/tour-within/:distance/center/:latlong/unit/:unit')
  .get(tourController.getTourWithin);

// /distances/:latlong/unit/:unit
router
  .route('/distances/:latlong/unit/:unit')
  .get(tourController.getDistances);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
