const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

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
    token,
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
    token,
  });
});

// @desc    Forgot Password
// @route   POST /api/v1/users/forgotpassword
// @access  Public
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;

  if (!email) {
    return next(new AppError(`Please provide email`), 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new AppError(`There is no user with email address`),
      404,
    );
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send if to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore thes email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'You password reset token (valid for 10 min)',
      message,
    });
  } catch (err) {
    // กรณีส่ง email ไม่สำเร็จ
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending email. Try again letter!',
        500,
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});

// @desc    Reset Password
// @route   PATCH /api/v1/users/resetpassword/:resetToken
// @access  Public
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // change password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access',
        401,
      ),
    );
  }
  const token = req.headers.authorization.split(' ')[1];

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    config.jwt.secret,
  );

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The token belonging to this user does not longer exist',
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (
    await currentUser.changedPasswordAfterCreatedToken(decoded.iat)
  ) {
    return next(
      new AppError(
        'User recently change password! Please log in again',
        401,
      ),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // รับมาเป็น array จาก route
    // เป็น function ซ้อน เพราะ middleware ปกติ
    // จะรับ arg จาก middleware ไม่ได้ จึงต้องใช้ closures
    if (!roles.includes(req.user.role)) {
      // check req.user.role ว่าตรงกับ roles ที่จำกัดมั้ย
      return next(
        new AppError(
          'You do not have permission to perform this action',
          403,
        ),
      );
    }

    next();
  };
};
