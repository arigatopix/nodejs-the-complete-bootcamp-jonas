const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewController.getOverview);

// /tours/:slug
router.get('/tour/:slug', viewController.getTour);

router.get('/login', viewController.login);

module.exports = router;
