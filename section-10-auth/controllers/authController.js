const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Sign up new user
// @route   POST /api/v1/users/signup
// @access  Public
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  // create token
  const token = jwt.sign({ id: newUser._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  res.status(200).json({
    status: 'success',
    data: {
      token,
    }
  });
});
