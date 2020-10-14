const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getOverview);

// /tours/:slug
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
