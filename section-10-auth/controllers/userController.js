const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFileds) => {
  // obj = req.body = { name: 'j', email: 'ee@gmail.com', role: 'admin'}
  const newObj = {};

  Object.keys(obj).map(el => {
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// @desc    Update user detail
// @route   PATCH /api/v1/users/updateMe
// @access  Private
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  // ต้องการแยก routes ชัดเจน
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updatepassword',
        404,
      ),
    );
  }

  // 2) Filterd out unwanted fields
  // update เฉพาะ field ที่อนุญาต
  const filterdBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const user = await User.findByIdAndUpdate(
    req.user.id,
    filterdBody,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
