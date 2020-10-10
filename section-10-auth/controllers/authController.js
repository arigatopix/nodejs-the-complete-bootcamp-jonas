const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Generate Token
const signToken = id => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// @desc    Sign up new user
// @route   POST /api/v1/users/signup
// @access  Public
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  // create token
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    data: {
      token,
    },
  });
});

// @desc    Log user in
// @route   POST /api/v1/users/login
// @access  Public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new AppError(`Please provide email and password`),
      400,
    );
  }

  // 2) Check if email and password exist
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError(`Incorrect email: ${email}`, 401));
  }

  // check password
  const isMatchedPassword = await user.correctPassword(password);

  if (!isMatchedPassword) {
    return next(new AppError('Incorrect password', 401));
  }

  // if everything ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});
