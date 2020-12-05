const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/sendEmail');

// Generate Token
const signToken = id => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + config.jwt.cookieExpiresIn * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'],
  });

  // REMOVE User password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

  // Send email to new user
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(user, url).sendWelcome();

  // create token
  createSendToken(user, 201, req, res);
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
  createSendToken(user, 200, req, res);
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

  try {
    // 3) Send if to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();
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
  createSendToken(user, 200, req, res);
});

// @desc    Update Password
// @route   PATCH /api/v1/users/updateepassword
// @access  Private
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  // ! อย่าลืมเอา select password
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  const isMatchedPassword = await user.correctPassword(
    req.body.currentPassword,
  );

  if (!isMatchedPassword) {
    return next(new AppError('Incorrect password', 401));
  }

  // 3) If so, update password
  // User.findByIdAndUpdate() will NOT work as intended
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

// @desc    Log out
// @route   GET /api/v1/users/logout
// @access  Public
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });
  res.status(200).json({
    status: 'success',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access',
        401,
      ),
    );
  }

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
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) CHECK COOKIES
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        config.jwt.secret,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (
        await currentUser.changedPasswordAfterCreatedToken(
          decoded.iat,
        )
      ) {
        return next();
      }

      // THERE IS LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

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
